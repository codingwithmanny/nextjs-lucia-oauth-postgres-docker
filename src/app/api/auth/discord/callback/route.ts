// Imports
// =================================
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { discord, lucia } from "@/lib/lucia";
import db from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { userTable, accountTable } from "@/lib/db/schema";

// Config
// =================================

// Routes
// =================================
export const GET = async (request: Request) => {
  // Get params
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("discord_oauth_state")?.value ?? null;

  // Validate data
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await discord.validateAuthorizationCode(code);
    const { accessToken, refreshToken, accessTokenExpiresAt } = tokens;

    const user = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const userJson = await user.json();

    // Validate if user already exists
    const existingUser = await db.query.userTable.findFirst({
      where: (table) => eq(table.provider_id, userJson.id),
      with: {
        accounts: {
          where: (table) => eq(table.provider, "discord"),
        },
      },
    });

    let userId = existingUser?.id ?? '';

    if (!existingUser) {
      const createUser = await db
      .insert(userTable)
      .values({
        name: userJson.username,
        email: userJson.email,
        provider_id: userJson.id,
      })
      .returning({
        id: userTable.id,
        email: userTable.email,
      });

      userId = createUser?.[0].id;
    }

    // Update account
    if (!existingUser?.accounts?.length) {
      await db
        .insert(accountTable)
        .values({
          userId,
          provider: "discord",
          providerAccountId: userJson.id,
          accessToken,
          refreshToken,
          expiresAt: accessTokenExpiresAt.toISOString(),
          tokenType: "access_token",
          scope: "identify email",
        });
    } else {
      await db
        .update(accountTable)
        .set({
          accessToken,
          refreshToken,
          expiresAt: accessTokenExpiresAt.toISOString(),
        })
        .where(eq(accountTable.userId, userId) && eq(accountTable.provider, "discord"));
    }

    // Update user email
    await db
      .update(userTable)
      .set({
        email: userJson.email,
      })
      .where(eq(userTable.id, userId));
      
    // Set session
    const session = await lucia.createSession(userId, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);

    // Redirect to home
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  } catch (e) {
    if (
      e instanceof OAuth2RequestError &&
      e.message === "bad_verification_code"
    ) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
};

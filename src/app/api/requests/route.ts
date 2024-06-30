// Imports
// =================================
import { discord, validateRequest } from "@/lib/lucia";
import db from "@/lib/db";
import { accountTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Routes
// =================================
export const POST = async (request: Request) => {
  const { session } = await validateRequest();
  const json = await request.json();
  const { provider, action } = json;

  // Get user access Token
  const user = await db.query.accountTable.findFirst({
    where: (table, { eq }) => eq(table.userId, session?.userId ?? '') && eq(table.provider, provider)
  });

  let response: any;

  if (!['refreshAccessToken', 'revokeToken'].includes(action)) {
    // Provider dictionary
    const providerUrl: { [key: string]: any } = {
      discord: "https://discord.com"
    };
    // Get the type of the key name
    const actionRequest = await fetch(`${providerUrl[provider as string]}${action}`, {
      headers: {
        Authorization: `Bearer ${user?.accessToken ?? ''}`,
      },
    });
    response = await actionRequest.json();
  } else if (action === 'refreshAccessToken') {
    const tokens = await discord.refreshAccessToken(user?.refreshToken ?? '');

    // Update account table
    response = await db
      .update(accountTable)
      .set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.accessTokenExpiresAt.toISOString(),
      })
      .where(eq(accountTable.userId, session?.userId ?? '') && eq(accountTable.provider, provider))
      .returning({
        accessToken: accountTable.accessToken,
        refreshToken: accountTable.refreshToken,
        expiresAt: accountTable.expiresAt,
      });
  }
  return Response.json({
    provider,
    action,
    response
  });
};
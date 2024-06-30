// Imports
// =================================
import { Lucia } from "lucia";
import adapter from "./adapter";
import { cookies } from "next/headers";
import { cache } from "react";
import { Discord } from "arctic";
import { env } from "@/env";

// Types
// =================================
// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      provider_id: string;
      username: string;
    }
  }
};

// Lucia Configuration
// =================================
/**
 * Create a new instance of Lucia
 */
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      providerId: attributes.provider_id,
      username: attributes.username,
    }
  }
});

// OAuth Configurations
// =================================
/**
 * Discord OAuth Configuration
 */
export const discord = new Discord(
  env.DISCORD_CLIENT_ID,
  env.DISCORD_CLIENT_SECRET,
  env.DISCORD_REDIRECT_URI
);

// Validation
// =================================
/**
 * Validate the request and return the user and session
 */
export const validateRequest = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null

  if (!sessionId)
    return {
      user: null,
      session: null,
    }

  const { user, session } = await lucia.validateSession(sessionId)
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie()
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  }
  return {
    user,
    session,
  }
});

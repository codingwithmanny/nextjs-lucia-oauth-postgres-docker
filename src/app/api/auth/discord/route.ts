// Imports
// =================================
import { generateState } from "arctic";
import { cookies } from "next/headers";
import { discord } from "@/lib/lucia";

// Routes
// =================================
export const GET = async (_request: Request) => {
	const state = generateState();
	const url = await discord.createAuthorizationURL(state, {
    scopes: ["identify", "email"]
  });

	cookies().set("discord_oauth_state", state, {
		path: "/",
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax"
	});

	return Response.redirect(url);
};
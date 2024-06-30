"use client"

// Imports
// =================================
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Validations
// =================================
export const FormSchemaSignIn = z.object({
  email: z.string().email()
});

// Component
// =================================
export default function FormSignIn() {
  // Render
  return <>
    <Link href="/api/auth/discord">
      <Button>Sign in with Discord</Button>
    </Link>
  </>
}

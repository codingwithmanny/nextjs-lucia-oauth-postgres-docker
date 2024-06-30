// Imports
// =================================
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";

// Configuration
// =================================
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "NextJS Lucia OAuth Postgres Docker",
  description: "The following is an example implementing Lucia OAuth with postgres.",
};

// Main Layout
// =================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-backgroud font-sans antialiased",
          fontSans.variable
        )}
      >
        <main>
          <div className="p-8">
            <h1 className="text-4xl font-bold tracking-tight mb-6">
            NextJS Lucia OAuth Postgres Docker
            </h1>
            <p className="leading-7 mb-6">
              The following is an example implementing{" "}
              <a href="https://lucia-auth.com" target="_blank">
                Lucia
              </a>{" "}
              authentication with OAuth and postgres.
            </p>

            <hr className="mb-6" />
            {children}
          </div>
        </main>
        <Toaster />
      </body>
    </html>
  );
};

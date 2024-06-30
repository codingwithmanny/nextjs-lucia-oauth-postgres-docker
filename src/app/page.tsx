// Imports
// =================================
import { validateRequest } from "@/lib/lucia";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { signOut } from "@/actions/signout";
import { eq } from "drizzle-orm";
import { accountTable } from "@/lib/db/schema";
import db from "@/lib/db";
import APIRequests from "@/components/APIRequests";

// Page Component
// =================================
export default async function Home() {
  // Server Side Requests
  const { user } = await validateRequest();

  // Session Handling
  if (!user) {
    return redirect("/auth/signin");
  }

  const accounts = await db.query.accountTable.findMany({
    where: eq(accountTable.userId, user.id),
  });

  // Render
  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Signed In</CardTitle>
          <CardDescription>
            You have been successfully signed in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-muted rounded-lg mb-6">
            <code>{JSON.stringify({ user })}</code>
          </pre>
          <form action={signOut}>
            <Button>Sign Out</Button>
          </form>
        </CardContent>
      </Card>

      <hr />

      <h2 className="font-heading mt-12 mb-8 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">Accounts</h2>

      {accounts
        ?.map(((account, key) => <section key={`${account.provider}-${key}`}>
          <h3 className="font-heading capitalize mt-8 mb-6 scroll-m-20 text-xl font-semibold tracking-tight">
            {account.provider}
          </h3>
          <APIRequests
            provider="discord"
            userInfoEndpoint="/api/users/@me"
          />

        </section>))}
      {/* <pre className="p-4 bg-muted rounded-lg mb-6">
        <code>{JSON.stringify({ accounts })}</code>
      </pre> */}
    </>
  );
}

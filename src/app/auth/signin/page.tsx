// Imports
// =================================
import FormSignIn from "@/components/FormSignIn";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { validateRequest } from "@/lib/lucia";
import { redirect } from "next/navigation";

// Page Component
// =================================
export default async function SignIn() {
  // Server Side Requests
  const { user } = await validateRequest();

  // Session Handling
  if (user) {
    return redirect("/");
  }

  // Render
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Sign in with OAuth account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormSignIn />
        </CardContent>
      </Card>
    </>
  );
}

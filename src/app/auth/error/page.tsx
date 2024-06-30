// Imports
// =================================
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Page Component
// =================================
export default async function Error({ searchParams }: { searchParams: { message?: string } } ) {
  // Render
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            {searchParams?.message ? searchParams.message : 'An error occurred.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </CardContent>
      </Card>
    </>
  );
}

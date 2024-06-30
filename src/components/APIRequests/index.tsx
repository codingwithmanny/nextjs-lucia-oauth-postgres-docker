"use client";

// Imports
// =================================
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { set } from "zod";

// Component
// =================================
export default function APIRequest({ provider, userInfoEndpoint }: { provider?: string, userInfoEndpoint: string }) {
  // State / Props
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<unknown>(undefined);

  // Requests
  const apiRequests = (action: string) => async () => {
    console.group("userInfo");
    setIsLoading(true);

    try {
      const result = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider,
          action,
         }),
      });
      const json = await result.json();
      setIsLoading(false);
      setResponse(json);
    } catch (error) {
      setResponse({ error });
    }
    setIsLoading(false);
    console.groupEnd();
  };

  // Render
  return (
    <>
      <div className="flex gap-4 mb-6">
        <Button onClick={apiRequests(userInfoEndpoint)}>User Info</Button>
        <Button onClick={apiRequests('refreshAccessToken')}>Refresh Token</Button>
      </div>
      <pre className="p-4 bg-muted rounded-lg mb-6">
        <code>{isLoading ? 'Loading...' : JSON.stringify(response, null, ' ')}</code>
      </pre>
    </>
  );
}

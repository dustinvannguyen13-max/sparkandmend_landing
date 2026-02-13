"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/ui/primary-button";

const AdminLoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to sign in.");
      }
      const next = searchParams?.get("next") || "/dashboard";
      router.push(next);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="admin-email">Email</Label>
        <Input
          id="admin-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@sparkandmend.co.uk"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="admin-code">Access code</Label>
        <Input
          id="admin-code"
          type="password"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Enter your admin access code"
          required
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center gap-3">
        <PrimaryButton type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </PrimaryButton>
        <Button variant="outline" type="button" onClick={() => router.push("/")}>
          Back to site
        </Button>
      </div>
    </form>
  );
};

export default AdminLoginForm;

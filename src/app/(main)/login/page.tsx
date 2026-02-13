import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/admin-login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminSession } from "@/lib/admin/auth";
import { generateMetadata } from "@/utils";

export const metadata: Metadata = {
  ...generateMetadata({
    title: "Admin Login | Spark & Mend",
    description: "Admin access for Spark & Mend bookings dashboard.",
    noIndex: true,
  }),
};

const LoginPage = () => {
  const session = getAdminSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Admin login</h1>
          <p className="text-sm text-muted-foreground">
            Access the Spark & Mend bookings dashboard.
          </p>
        </div>
        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminLoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

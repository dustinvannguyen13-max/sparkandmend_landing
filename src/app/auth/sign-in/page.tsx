import { Icons, SignInForm } from "@/components";
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border/70 bg-card/90 p-8 shadow-[0_30px_70px_-54px_hsl(var(--primary)/0.45)]">
        <div className="flex items-center w-full pb-6 border-b border-border/60">
          <Link href="/#home" className="flex items-center gap-x-2">
            <Icons.logo className="w-6 h-6" />
            <h1 className="text-base font-semibold uppercase tracking-[0.02em] text-primary whitespace-nowrap">
              Spark &amp; Mend
            </h1>
          </Link>
        </div>

        <SignInForm />

        <div className="flex flex-col items-start w-full">
          <p className="text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-primary">
              Terms of Service{" "}
            </Link>
            and{" "}
            <Link href="/privacy" className="text-primary">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex items-start mt-8 border-t border-border/60 pt-6 w-full">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

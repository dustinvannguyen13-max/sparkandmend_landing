"use client";

const AuthCallbackPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-border/70 bg-card/90 px-8 py-10 text-center shadow-[0_30px_70px_-54px_hsl(var(--primary)/0.45)]">
        <div className="border-[3px] border-foreground/30 rounded-full border-b-primary animate-loading w-9 h-9"></div>
        <p className="text-lg font-semibold text-foreground">
          Verifying your account...
        </p>
        <p className="text-sm text-muted-foreground">Please wait a moment.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;

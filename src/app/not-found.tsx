import { Footer, Navbar } from "@/components";
import { PrimaryButton } from "@/components/ui/primary-button";
import Link from "next/link";

const NotFound = () => {
  return (
    <main className="relative flex flex-col items-center justify-center px-4">
      <Navbar />

      <div className="flex flex-col items-center justify-center mx-auto h-screen">
        <div className="flex items-center justify-center h-full flex-col">
          <span className="text-xs font-semibold px-3.5 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30">
            404
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-5">
            Not Found
          </h1>
          <p className="text-base text-muted-foreground font-medium mt-5 text-center mx-auto max-w-xl">
            The page you are looking for does not exist. <br /> But don&apos;t
            worry, we&apos;ve got you covered. You can{" "}
            <Link href="/cleaning-results-plymouth" className="text-foreground">
              see our results
            </Link>
            .
          </p>
          <PrimaryButton asChild className="mt-8">
            <Link href="/">Back to homepage</Link>
          </PrimaryButton>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default NotFound;

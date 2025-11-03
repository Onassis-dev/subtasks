import { Button } from "@/components/ui/button";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function CTABanner() {
  return (
    <div className="px-6">
      <div className="dark:border text-center relative overflow-hidden my-20 w-full dark bg-background text-foreground max-w-screen-lg mx-auto rounded-2xl py-10 md:py-16 px-6 md:px-14">
        <div className="relative z-0 flex flex-col gap-3 mb-6">
          <h3 className="text-3xl md:text-4xl font-semibold">
            Ready to start solving your problems?
          </h3>
          <p className="mt-2 text-base md:text-lg">
            Try it out now. Completely free, no signup required.
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/dashboard">
            Get Started <ArrowTopRightIcon className="size-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

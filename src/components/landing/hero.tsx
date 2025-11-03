import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowTopRightIcon, StarFilledIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center py-20 px-6">
      <div className="md:mt-6 flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <Badge className="bg-primary rounded-full py-1 border-none">
            <StarFilledIcon className="text-yellow-500" /> Completely Free
          </Badge>
          <h1 className="mt-6 max-w-[20ch] text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold !leading-[1.2] tracking-tight">
            The Ultimate Problem solving tool
          </h1>
          <p className="mt-6 max-w-[60ch] xs:text-lg mx-auto">
            <i>Problem decomposition</i> is a technique used to break down a
            complex problem into smaller, easier-to-handle parts. That&apos;s
            what this app is all about.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center sm:justify-center ">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full text-base"
              asChild
            >
              <Link href="/dashboard">
                Get Started <ArrowTopRightIcon className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
// import {
//   DribbbleIcon,
//   GithubIcon,
//   TwitchIcon,
//   TwitterIcon,
// } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "Pricing",
    href: "#pricing",
  },
  {
    title: "FAQ",
    href: "#faq",
  },
  {
    title: "Testimonials",
    href: "#testimonials",
  },
  {
    title: "Privacy",
    href: "#privacy",
  },
];

const Footer = () => {
  return (
    <footer className="dark:border-t mt-40 dark bg-background text-foreground px-2 py-5">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <p className="text-2xl font-semibold">Subtasks</p>
          <a
            href="https://onassis.dev"
            target="_blank"
            className="text-xs text-muted-foreground block"
          >
            By Onassis Salinas
          </a>
        </div>
        <div className="flex items-center justify-between">
          <a href="https://github.com/Onassis-dev/subtasks" target="_blank">
            <GitHubLogoIcon className="size-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

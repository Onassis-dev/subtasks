"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
    if (pathname.startsWith("/dashboard")) {
      router.replace("/dashboard");
    } else {
      router.replace("/");
    }
  }, [pathname, router]);

  return null;
}

"use client";

export const dynamic = "force-static";
import { AppSidebar } from "@/components/layout/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { useColorStore } from "@/lib/themes";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { syncColor } = useColorStore();
  useEffect(() => {
    syncColor();
  }, []);

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        storageKey="subt"
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
      <Toaster />
    </>
  );
}

import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Subtasks",
  icons: {
    icon: "/favicon/favicon.svg",
    shortcut: "/favicon/favicon.svg",
    apple: "/favicon/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

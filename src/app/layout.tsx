import type { Metadata } from "next";

import { AuthProvider } from "@/components/providers/auth-provider";

import "./globals.scss";

export const metadata: Metadata = {
  title: "DummyJSON Shop",
  description: "Test assignment with Next.js, Zustand and DummyJSON API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

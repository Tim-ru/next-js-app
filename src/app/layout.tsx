import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AuthProvider } from "@/components/providers/auth-provider";

import styles from "./layout.module.scss";
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
        <AuthProvider>
          <div className={styles.app}>
            <Header />
            <div className={styles.content}>{children}</div>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

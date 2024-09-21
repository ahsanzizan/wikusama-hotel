import NextAuthProvider from "@/components/providers/NextAuthProvider";
import ProgressBarProvider from "@/components/providers/ProgressBarProvider";
import ToasterProvider from "@/components/providers/ToasterProvider";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wikusama Hotel Information Management System",
  description:
    "Wikusama Hotel Information Management System is an information management system for Wikusama Hotel.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <NextAuthProvider>
          <ToasterProvider />
          <ProgressBarProvider />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wikusama Hotel Information Management System",
  description:
    "Wikusama Hotel Information Management System is an information management system for Wikusama Hotel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}

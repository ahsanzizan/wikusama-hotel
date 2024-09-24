import AdminLayoutContainer from "@/components/layout/AdminLayoutContainer";
import { getServerSession } from "@/lib/next-auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin Panel",
};

export default async function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  if (session?.user?.role !== "ADMIN") return redirect("/forbidden");

  return <AdminLayoutContainer>{children}</AdminLayoutContainer>;
}

import { buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

export default async function VerifyWarning({
  searchParams,
}: {
  searchParams: { email: string };
}) {
  const { email } = searchParams;
  if (!email || !z.string().email().safeParse(email).success) return notFound();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return notFound();

  if (user?.verified) {
    if (user.role === "ADMIN") {
      return redirect("/admin");
    } else if (user.role === "RECEPTIONIST") {
      return redirect("/receptionist");
    }

    return redirect("/");
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="bg-primary-50 text-primary-400 mb-8 inline-block rounded-full p-[18px]">
        <Mail className="size-20" />
      </div>
      <h1 className="mb-3">Check Your Email</h1>
      <p className="mb-[34px]">
        Confirm your account at the email {user.email}
      </p>
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "outline" }), "group")}
      >
        <ArrowLeft className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />{" "}
        Back to home
      </Link>
    </div>
  );
}

import { buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ArrowLeft, CheckCheck } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  if (!searchParams.token) return notFound();

  const user = await prisma.user.findUnique({
    where: { verification_token: searchParams.token },
  });

  console.log(searchParams.token);

  if (!user) return notFound();
  if (user.verified) return redirect("/dashboard");

  // Update the verified property of the user
  await prisma.user.update({
    where: { id: user.id },
    data: { verified: true, verification_token: null },
  });

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="bg-primary-50 text-primary-400 mb-8 inline-block rounded-full p-[18px]">
          <CheckCheck className="size-20" />
        </div>
        <h2 className="mb-3">Successfully Verified Your Account</h2>
        <p className="mb-[34px]">
          Account with the email {user.email} has been verified successfully!
        </p>
        <Link
          href="/auth/login"
          className={cn(buttonVariants({ variant: "outline" }), "group")}
        >
          <ArrowLeft className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />{" "}
          Login to account
        </Link>
      </div>
    </main>
  );
}

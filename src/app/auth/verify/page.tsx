import { buttonVariants } from "@/components/ui/button";
import { findUser, updateUser } from "@/database/user.query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FaArrowLeft, FaCheck } from "react-icons/fa6";

export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  if (!searchParams.token) return notFound();

  const user = await findUser({ verification_token: searchParams.token });

  if (!user) return notFound();
  if (user.verified) return redirect("/dashboard");

  // Update the verified property of the user
  await updateUser(
    { id: user.id },
    { verified: true, verification_token: null },
  );

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="bg-primary-50 text-primary-400 mb-8 inline-block rounded-full p-[18px]">
          <FaCheck className="size-20" />
        </div>
        <h2 className="mb-3">Successfully Verified Your Account</h2>
        <p className="mb-[34px]">
          Account with the email {user.email} has been verified successfully!
        </p>
        <Link
          href="/auth/login"
          className={cn(buttonVariants({ variant: "outline" }), "group")}
        >
          <FaArrowLeft className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />{" "}
          Login to account
        </Link>
      </div>
    </main>
  );
}

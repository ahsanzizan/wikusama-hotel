"use client";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ReactNode } from "react";
import { buttonVariants } from "../ui/button";

export default function PageContainer({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <>
      <nav className="fixed z-[999] w-full bg-white/15 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1169px] items-center justify-between px-5 py-4">
          <Link href={"/"} className="w-[120px]">
            <span className="block h-[48px] w-[125px] bg-[url(/logo.png)] bg-contain text-transparent">
              Wikusama Hotel
            </span>
          </Link>
          <div
            className="flex w-full max-w-[160px] items-center justify-between"
            style={{ justifyContent: session?.user ? "end" : "space-between" }}
          >
            {session?.user ? (
              <Link
                href={session.user.role == "ADMIN" ? "/admin" : "/dashboard"}
                className={buttonVariants({ variant: "default" })}
              >
                {session.user.email}
              </Link>
            ) : (
              <>
                <Link
                  href={"/auth/login"}
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Login
                </Link>
                <Link
                  href={"/auth/register"}
                  className={buttonVariants({ variant: "default" })}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main
        className={cn(
          "flex flex-col items-center justify-center px-4 pb-8 pt-28",
          className,
        )}
      >
        {children}
      </main>
      <footer className="px-4 py-8"></footer>
    </>
  );
}

"use client";
import { cn } from "@/lib/utils";
import { History, User } from "lucide-react";
import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ReactNode } from "react";
import { Button, buttonVariants } from "../ui/button";

function Navbar({ session }: { session: Session | null }) {
  return (
    <nav className="fixed z-[999] w-full bg-black">
      <div className="mx-auto flex w-full max-w-[1169px] items-center justify-between px-5 py-4">
        <Link href={"/"} className="w-[55px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={56}
            height={30}
            fill="none"
          >
            <path
              fill="#ededed"
              stroke="#ededed"
              d="m28.671 7.07-.334-.3-.335.3L8.778 24.4H1.973L28.337.673 54.7 24.4h-6.805L28.671 7.07ZM6.703.5h7.3v4.284l-7.3 6.546V.5Z"
            />
            <mask
              id="a"
              width={19}
              height={13}
              x={19}
              y={14}
              fill="#ededed"
              maskUnits="userSpaceOnUse"
            >
              <path fill="#fff" d="M19 14h19v13H19z" />
              <path d="M25.072 14.672h2.048l1.296 3.76 1.312-3.76h2.032l-1.952 5.168 1.44 3.616 3.216-8.816h2.4L32.32 26h-1.904l-2-4.768L26.432 26h-1.904L20 14.64h2.368l3.232 8.816 1.408-3.616-1.936-5.168Z" />
            </mask>
            <path
              fill="#ededed"
              d="M25.072 14.672h2.048l1.296 3.76 1.312-3.76h2.032l-1.952 5.168 1.44 3.616 3.216-8.816h2.4L32.32 26h-1.904l-2-4.768L26.432 26h-1.904L20 14.64h2.368l3.232 8.816 1.408-3.616-1.936-5.168Z"
            />
            <path
              fill="#ededed"
              d="M25.072 14.672v-.5h-.721l.253.675.468-.175Zm2.048 0 .473-.163-.116-.337h-.357v.5Zm1.296 3.76-.473.163.47 1.363.475-1.361-.472-.165Zm1.312-3.76v-.5h-.355l-.117.335.472.165Zm2.032 0 .468.177.255-.677h-.723v.5Zm-1.952 5.168-.468-.177-.068.182.072.18.464-.185Zm1.44 3.616-.465.185.485 1.218.45-1.232-.47-.171Zm3.216-8.816v-.5h-.35l-.12.329.47.171Zm2.4 0 .464.186.274-.686h-.738v.5ZM32.32 26v.5h.338l.126-.314L32.32 26Zm-1.904 0-.461.193.129.307h.332V26Zm-2-4.768.461-.193-.463-1.104-.46 1.105.462.192ZM26.432 26v.5h.334l.128-.308-.462-.192Zm-1.904 0-.464.185.125.315h.339V26ZM20 14.64v-.5h-.738l.273.685.465-.185Zm2.368 0 .47-.172-.12-.328h-.35v.5Zm3.232 8.816-.47.172.456 1.242.48-1.233-.466-.181Zm1.408-3.616.466.181.07-.178-.068-.178-.468.175Zm-1.936-4.668h2.048v-1h-2.048v1Zm1.575-.337 1.296 3.76.946-.326-1.296-3.76-.946.326Zm2.241 3.762 1.312-3.76-.944-.33-1.312 3.76.944.33Zm.84-3.425h2.032v-1h-2.032v1Zm1.564-.677-1.952 5.168.936.354 1.952-5.168-.936-.354Zm-1.949 5.53 1.44 3.616.93-.37-1.44-3.616-.93.37Zm2.375 3.602 3.216-8.816-.94-.342-3.216 8.816.94.342Zm2.746-8.487h2.4v-1h-2.4v1Zm1.936-.686-4.544 11.36.928.372 4.544-11.36-.928-.372ZM32.32 25.5h-1.904v1h1.904v-1Zm-1.443.307-2-4.768-.922.386 2 4.768.922-.386Zm-2.923-4.767-1.984 4.768.924.384 1.984-4.768-.924-.384Zm-1.522 4.46h-1.904v1h1.904v-1Zm-1.44.315-4.527-11.36-.93.37 4.529 11.36.928-.37ZM20 15.14h2.368v-1H20v1Zm1.899-.328 3.232 8.816.938-.344-3.232-8.816-.938.344Zm4.167 8.825 1.408-3.616-.932-.362-1.408 3.616.932.362Zm1.41-3.972-1.936-5.168-.936.35 1.936 5.168.936-.35Z"
              mask="url(#a)"
            />
          </svg>
        </Link>
        <div className="flex items-center gap-4">
          {session?.user?.role === "GUEST" && (
            <>
              <Link
                href={"/bookings"}
                className={buttonVariants({ variant: "default" })}
              >
                <History className="mr-1" />
                Bookings
              </Link>
              <Link
                href={"/profile"}
                className={buttonVariants({
                  variant: "secondary",
                })}
              >
                <User />
              </Link>
            </>
          )}
          {!session?.user && (
            <Link
              href="/auth/login"
              className={buttonVariants({ variant: "secondary" })}
            >
              Login
            </Link>
          )}
          {session?.user?.role === "RECEPTIONIST" && (
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              className={buttonVariants({ variant: "destructive" })}
            >
              Logout
            </Button>
          )}
          {(session?.user?.role === "ADMIN" ||
            session?.user?.role === "RECEPTIONIST") && (
            <Link
              href={session.user.role === "ADMIN" ? "/admin" : "/receptionist"}
              className={buttonVariants({ variant: "secondary" })}
            >
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-white text-black">
      <div className="mx-auto flex max-w-[1169px] flex-col items-center justify-between gap-10 border-b border-neutral-300 px-5 py-14 md:grid-cols-5 md:flex-row md:gap-0 md:py-20">
        <div className="flex w-full flex-col gap-4 md:max-w-[280px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={56}
            height={30}
            fill="none"
          >
            <path
              fill="#0a0a0a"
              stroke="#0a0a0a"
              d="m28.671 7.07-.334-.3-.335.3L8.778 24.4H1.973L28.337.673 54.7 24.4h-6.805L28.671 7.07ZM6.703.5h7.3v4.284l-7.3 6.546V.5Z"
            />
            <mask
              id="a"
              width={19}
              height={13}
              x={19}
              y={14}
              fill="#0a0a0a"
              maskUnits="userSpaceOnUse"
            >
              <path fill="#fff" d="M19 14h19v13H19z" />
              <path d="M25.072 14.672h2.048l1.296 3.76 1.312-3.76h2.032l-1.952 5.168 1.44 3.616 3.216-8.816h2.4L32.32 26h-1.904l-2-4.768L26.432 26h-1.904L20 14.64h2.368l3.232 8.816 1.408-3.616-1.936-5.168Z" />
            </mask>
            <path
              fill="#0a0a0a"
              d="M25.072 14.672h2.048l1.296 3.76 1.312-3.76h2.032l-1.952 5.168 1.44 3.616 3.216-8.816h2.4L32.32 26h-1.904l-2-4.768L26.432 26h-1.904L20 14.64h2.368l3.232 8.816 1.408-3.616-1.936-5.168Z"
            />
            <path
              fill="#0a0a0a"
              d="M25.072 14.672v-.5h-.721l.253.675.468-.175Zm2.048 0 .473-.163-.116-.337h-.357v.5Zm1.296 3.76-.473.163.47 1.363.475-1.361-.472-.165Zm1.312-3.76v-.5h-.355l-.117.335.472.165Zm2.032 0 .468.177.255-.677h-.723v.5Zm-1.952 5.168-.468-.177-.068.182.072.18.464-.185Zm1.44 3.616-.465.185.485 1.218.45-1.232-.47-.171Zm3.216-8.816v-.5h-.35l-.12.329.47.171Zm2.4 0 .464.186.274-.686h-.738v.5ZM32.32 26v.5h.338l.126-.314L32.32 26Zm-1.904 0-.461.193.129.307h.332V26Zm-2-4.768.461-.193-.463-1.104-.46 1.105.462.192ZM26.432 26v.5h.334l.128-.308-.462-.192Zm-1.904 0-.464.185.125.315h.339V26ZM20 14.64v-.5h-.738l.273.685.465-.185Zm2.368 0 .47-.172-.12-.328h-.35v.5Zm3.232 8.816-.47.172.456 1.242.48-1.233-.466-.181Zm1.408-3.616.466.181.07-.178-.068-.178-.468.175Zm-1.936-4.668h2.048v-1h-2.048v1Zm1.575-.337 1.296 3.76.946-.326-1.296-3.76-.946.326Zm2.241 3.762 1.312-3.76-.944-.33-1.312 3.76.944.33Zm.84-3.425h2.032v-1h-2.032v1Zm1.564-.677-1.952 5.168.936.354 1.952-5.168-.936-.354Zm-1.949 5.53 1.44 3.616.93-.37-1.44-3.616-.93.37Zm2.375 3.602 3.216-8.816-.94-.342-3.216 8.816.94.342Zm2.746-8.487h2.4v-1h-2.4v1Zm1.936-.686-4.544 11.36.928.372 4.544-11.36-.928-.372ZM32.32 25.5h-1.904v1h1.904v-1Zm-1.443.307-2-4.768-.922.386 2 4.768.922-.386Zm-2.923-4.767-1.984 4.768.924.384 1.984-4.768-.924-.384Zm-1.522 4.46h-1.904v1h1.904v-1Zm-1.44.315-4.527-11.36-.93.37 4.529 11.36.928-.37ZM20 15.14h2.368v-1H20v1Zm1.899-.328 3.232 8.816.938-.344-3.232-8.816-.938.344Zm4.167 8.825 1.408-3.616-.932-.362-1.408 3.616.932.362Zm1.41-3.972-1.936-5.168-.936.35 1.936 5.168.936-.35Z"
              mask="url(#a)"
            />
          </svg>
          <p>
            Jalan Raya Salak Nomor 456, Kawasan Industri Maju, Kota Surabaya,
            Indonesia 67890
          </p>
        </div>
        <div className="flex w-full flex-col items-start gap-4 md:max-w-[120px]">
          <h3>Quick Links</h3>
          <ul className="flex flex-col items-start justify-start gap-2 text-sm">
            <li>
              <Link href={"/rooms/book"}>Room Booking</Link>
            </li>
            <li>
              <Link href={"/rooms"}>Rooms</Link>
            </li>
            <li>
              <Link href={"mailto:ahsanaz461@gmail.com"}>Contact</Link>
            </li>
          </ul>
        </div>
        <div className="flex w-full flex-col items-start gap-4 md:max-w-[120px]">
          <h3>Company</h3>
          <ul className="flex flex-col items-start justify-start gap-2 text-sm">
            <li>
              <Link href={"#"}>Privacy Policy</Link>
            </li>
            <li>
              <Link href={"#"}>Refund Policy</Link>
            </li>
            <li>
              <Link href={"#"}>F.A.Q</Link>
            </li>
          </ul>
        </div>
        <div className="flex w-full flex-col items-start gap-4 md:max-w-[120px]">
          <h3>Socials</h3>
          <ul className="flex flex-col items-start justify-start gap-2 text-sm">
            <li>
              <Link href={"#"}>Instagram</Link>
            </li>
            <li>
              <Link href={"#"}>Twitter</Link>
            </li>
            <li>
              <Link href={"#"}>Facebook</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1169px] px-5 py-8">
        <p className="text-center">&copy; Wikusama Hotel 2024</p>
      </div>
    </footer>
  );
}

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
      <Navbar session={session} />
      <main
        className={cn(
          "mx-auto flex max-w-[1169px] flex-col items-center justify-center px-5 pb-8 pt-28",
          className,
        )}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}

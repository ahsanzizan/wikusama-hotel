"use client";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, ReactNode, useRef, useState } from "react";
import { FaBars, FaGauge, FaPersonBooth, FaUser, FaX } from "react-icons/fa6";
import { Button } from "../ui/button";

const routes = [
  {
    title: "Rooms",
    path: "/admin/rooms",
    regex: /^\/admin\/rooms(?:\/[A-Za-z0-9-]+)?(?:\?.*)?$/,
    icon: <FaPersonBooth />,
  },
  {
    title: "Room Types",
    path: "/admin/room-types",
    regex: /^\/admin\/room-types(?:\/[A-Za-z0-9-]+)?(?:\?.*)?$/,
    icon: <FaPersonBooth />,
  },
  {
    title: "Receptionists",
    path: "/admin/receptionists",
    regex: /^\/admin\/receptionists(?:\/[A-Za-z0-9-]+)?(?:\?.*)?$/,
    icon: <FaUser />,
  },
  {
    title: "Registered Users",
    path: "/admin/users",
    regex: /^\/admin\/users(?:\/[A-Za-z0-9-]+)?(?:\?.*)?$/,
    icon: <FaUser />,
  },
];

function Sidebar({ isActive }: { isActive: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      id="sidebar"
      className={`fixed ${
        isActive ? "w-80" : "w-0 opacity-0"
      } left-0 top-0 z-20 hidden h-full flex-shrink-0 bg-white transition-all duration-300 lg:flex lg:w-80 lg:opacity-100`}
      aria-label="Sidebar"
    >
      <div className="relative flex min-h-0 flex-1 flex-col bg-white px-4 pt-0">
        <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
          <div className="flex-1 space-y-1 bg-white px-3">
            <Link
              href={"/"}
              className="mb-10 flex w-full items-center gap-3 text-black"
            >
              <div>
                <Image
                  src={"/logo.png"}
                  alt="Logo Digifest"
                  width={120}
                  height={50}
                  className="pointer-events-none h-[50px] w-[90px]"
                />
              </div>
              <p className="font-bold text-black">Wikusama Hotel</p>
            </Link>
            <ul className="space-y-4 pb-2">
              <li>
                <Link
                  href={"/admin"}
                  className="text-primary-400 group flex items-center rounded-lg p-2 text-base font-normal text-black transition-all hover:bg-neutral-300"
                >
                  <FaGauge />
                  <p className="ml-2 whitespace-nowrap font-semibold text-black">
                    Dashboard
                  </p>
                </Link>
              </li>
              <p className="font-semibold text-black">Menu</p>
              {routes.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    className={cn(
                      (item.regex.test(pathname) ? "bg-neutral-300 " : "") +
                        "text-primary-400 group flex items-center rounded-lg p-2 text-base font-normal text-black transition-all hover:bg-neutral-300",
                    )}
                  >
                    {item.icon}
                    <p className="ml-3 whitespace-nowrap font-semibold text-black">
                      {item.title}
                    </p>
                  </Link>
                </li>
              ))}
              <Button
                variant={"destructive"}
                onClick={() => signOut({ callbackUrl: "/", redirect: true })}
                className="w-full justify-center"
              >
                Logout
              </Button>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Navbar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  function MenuItem({
    icon,
    title,
    href,
    regex,
  }: {
    icon: ReactNode;
    title: string;
    href: string;
    regex: RegExp;
  }) {
    return (
      <li>
        <Link
          href={href}
          onClick={() => setIsExpanded(false)}
          className={cn(
            (regex.test(pathname) ? "bg-neutral-300" : "") +
              "group flex items-center rounded-lg p-2 text-base font-normal text-black transition-all hover:bg-neutral-300",
          )}
        >
          {icon}
          <p className="ml-3 whitespace-nowrap font-semibold text-black">
            {title}
          </p>
        </Link>
      </li>
    );
  }

  return (
    <nav className="fixed z-[999] mx-auto flex w-full flex-col lg:hidden xl:relative">
      <div className="z-[999] flex w-full justify-between bg-white px-5 py-4 xl:max-w-[1192px] xl:bg-transparent xl:py-0">
        <Link href={"/"} className="block xl:mt-8">
          <Image
            src={"/logo.png"}
            alt="Logo Wikusama Hotel"
            width={120}
            height={50}
            className="pointer-events-none h-[30px] w-[60px]"
          />
        </Link>
        <button
          className="block xl:hidden"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <FaX className="text-black" />
          ) : (
            <FaBars className="text-black" />
          )}
        </button>
      </div>
      <div
        className={`z-[800] block w-full overflow-y-auto bg-white py-3 transition-all duration-500 xl:hidden ${
          isExpanded ? "mt-0" : "-mt-[1000px]"
        }`}
      >
        <div className="mx-5 my-[21px] flex flex-col items-start justify-start gap-8 text-start">
          <ul className="w-full space-y-4 pb-2">
            <MenuItem
              icon={<FaGauge />}
              title="Dashboard"
              href="/admin"
              regex={/^\/admin(?:\/[A-Za-z0-9-]+)?(?:\?.*)?$/}
            />
            <p className="font-semibold">Menu</p>
            {routes.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                title={item.title}
                href={item.path}
                regex={item.regex}
              />
            ))}
            <Button
              variant={"destructive"}
              onClick={() => signOut({ callbackUrl: "/", redirect: true })}
              className="w-full justify-center"
            >
              Logout
            </Button>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default function AdminLayoutContainer({
  children,
}: {
  children: ReactNode;
}) {
  const navRef = useRef(false);
  const pathname = usePathname().split("/");
  pathname.shift();

  return (
    <main className="flex min-h-screen w-full overflow-x-hidden overflow-y-scroll bg-black">
      <Sidebar isActive={navRef.current} />
      <Navbar />
      <div
        className={`bg-gray-900 opacity-50 ${
          navRef.current ? "" : "hidden"
        } fixed inset-0 z-10`}
        id="sidebarBackdrop"
      />
      <div
        id="main-content"
        className="relative mt-[90px] min-h-full w-full overflow-y-auto py-4 ps-2 lg:ml-64 lg:mt-0 lg:ps-24"
      >
        <nav className="w-full overflow-x-clip rounded-lg p-2 align-middle font-sans text-lg capitalize md:p-3 lg:text-xl">
          <ul className="flex items-center">
            <li>
              <Link href="/" className="font-semibold">
                home
              </Link>
            </li>
            {pathname.map((path, i) => {
              const href = "/" + pathname.slice(0, i + 1).join("/");
              return (
                <Fragment key={i}>
                  <li className="px-3">
                    <p>/</p>
                  </li>
                  <li>
                    <Link className="font-semibold" href={href}>
                      {path}
                    </Link>
                  </li>
                </Fragment>
              );
            })}
          </ul>
        </nav>
        <div className="overflow-y-auto px-2 pt-4">{children}</div>
      </div>
    </main>
  );
}

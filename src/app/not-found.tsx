import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

export default function NotFound() {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="mb-5 text-8xl">404</h1>
        <p className="mb-[34px]">
          Sorry, we could not find the page you are looking for.
        </p>
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          <FaArrowLeft className="mr-1 transition-transform duration-300 group-hover:-translate-x-1" />{" "}
          Go back
        </Link>
      </div>
    </main>
  );
}

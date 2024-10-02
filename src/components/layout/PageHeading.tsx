import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { FaArrowLeft } from "react-icons/fa6";

export default function PageHeading({
  title,
  description,
  backHref,
  isSmall,
}: {
  title: string;
  description: string;
  backHref: string;
  isSmall?: boolean;
}) {
  return (
    <div
      className={cn(
        "mb-12 flex gap-8",
        isSmall
          ? "max-w-lg flex-col items-start"
          : "flex-col items-start md:flex-row md:items-center",
      )}
    >
      <Link
        href={backHref}
        className={cn(buttonVariants({ variant: "secondary" }), "group w-fit")}
      >
        <FaArrowLeft className="mr-1 transition-transform duration-300 group-hover:-translate-x-1" />{" "}
        Back
      </Link>
      <div className="block text-white">
        <h1 className="mb-3">{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function PageHeading({
  title,
  description,
  backHref,
  isSmall,
  center,
}: {
  title: string;
  description: string;
  backHref: string;
  isSmall?: boolean;
  center?: boolean;
}) {
  return (
    <div className={cn("flex w-full", center ? "justify-center" : "")}>
      <div
        className={cn(
          "mb-12 flex gap-8",
          isSmall
            ? "max-w-lg flex-col items-start"
            : `flex-col items-start md:flex-row md:items-center`,
        )}
      >
        <Link
          href={backHref}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "group w-fit",
          )}
        >
          <ArrowLeft className="mr-1 transition-transform duration-300 group-hover:-translate-x-1" />{" "}
          Back
        </Link>
        <div className="block text-white">
          <h1 className="mb-3">{title}</h1>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

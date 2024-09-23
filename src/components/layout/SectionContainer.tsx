import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function SectionContainer({
  id,
  children,
  className,
}: {
  id: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className={cn("container py-16", className)}>
      {children}
    </section>
  );
}

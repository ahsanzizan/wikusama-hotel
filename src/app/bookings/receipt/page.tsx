import DownloadableReceipt from "@/components/utils/DownloadableReceipt";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReceiptContainer from "./components/ReceiptContainer";
import PageContainer from "@/components/layout/PageContainer";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa6";

export default async function ReceiptPrinting({
  searchParams,
}: {
  searchParams: { bookingId?: string };
}) {
  const { bookingId } = searchParams;
  if (!bookingId) return notFound();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      room: { include: { room_type: true } },
      guest: { select: { name: true, email: true } },
    },
  });
  if (!booking) return notFound();

  return (
    <PageContainer>
      <div className="mb-12 flex items-center gap-8">
        <Link
          href={"/bookings"}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "group w-fit",
          )}
        >
          <FaArrowLeft className="mr-1 transition-transform duration-300 group-hover:-translate-x-1" />{" "}
          Back
        </Link>
        <div className="block text-white">
          <h1 className="mb-3">Download Receipt</h1>
          <p>
            You can download your booking receipt that you got from your
            bookings.
          </p>
        </div>
      </div>
      <ReceiptContainer booking={booking} />
    </PageContainer>
  );
}

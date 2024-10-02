import PageContainer from "@/components/layout/PageContainer";
import PageHeading from "@/components/layout/PageHeading";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReceiptContainer from "./components/ReceiptContainer";

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
      <PageHeading
        title="Download Receipt"
        description="You can download your booking receipt that you got from your
            bookings."
        backHref="/bookings"
      />
      <ReceiptContainer booking={booking} />
    </PageContainer>
  );
}

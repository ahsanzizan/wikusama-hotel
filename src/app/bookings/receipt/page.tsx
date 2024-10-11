import PageContainer from "@/components/layout/PageContainer";
import PageHeading from "@/components/layout/PageHeading";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReceiptContainer from "./components/ReceiptContainer";
import { getServerSession } from "@/lib/next-auth";

export default async function ReceiptPrinting({
  searchParams,
}: {
  searchParams: { bookingId?: string };
}) {
  const { bookingId } = searchParams;
  if (!bookingId) return notFound();

  const session = await getServerSession();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      room: { include: { room_type: true } },
      guest: { select: { name: true, email: true } },
    },
  });
  if (!booking || booking.guestId !== session?.user?.id) return notFound();

  return (
    <PageContainer>
      <PageHeading
        title="Download Receipt"
        description="You can download your booking receipt that you got from your
            bookings."
        backHref="/bookings"
        center
      />
      <ReceiptContainer booking={booking} />
    </PageContainer>
  );
}

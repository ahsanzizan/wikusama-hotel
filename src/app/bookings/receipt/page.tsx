import DisableContextAndDevTools from "@/components/layout/DisableContextAndDevTools";
import PageContainer from "@/components/layout/PageContainer";
import { getServerSession } from "@/lib/next-auth";
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
      <DisableContextAndDevTools>
        <ReceiptContainer booking={booking} />
      </DisableContextAndDevTools>
    </PageContainer>
  );
}

import DisableContextAndDevTools from "@/components/layout/DisableContextAndDevTools";
import PageContainer from "@/components/layout/PageContainer";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReceiptContainer from "./components/ReceiptContainer";

export default async function ReceiptPrinting({
  searchParams,
}: {
  searchParams: { bookingReceiptId?: string };
}) {
  const { bookingReceiptId } = searchParams;
  if (!bookingReceiptId) return notFound();

  const session = await getServerSession();

  const bookingReceipt = await prisma.booking_receipt.findUnique({
    where: { id: bookingReceiptId },
    include: {
      booking: { include: { room: { include: { room_type: true } } } },
      user: { select: { name: true, email: true } },
    },
  });
  if (!bookingReceipt || bookingReceipt.userId !== session?.user?.id)
    return notFound();

  return (
    <PageContainer>
      <DisableContextAndDevTools>
        <ReceiptContainer bookingReceipt={bookingReceipt} />
      </DisableContextAndDevTools>
    </PageContainer>
  );
}

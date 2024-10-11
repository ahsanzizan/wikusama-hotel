import PageContainer from "@/components/layout/PageContainer";
import PageHeading from "@/components/layout/PageHeading";
import prisma from "@/lib/prisma";
import { stringifyDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import ReviewForm from "./components/form";
import { getServerSession } from "@/lib/next-auth";

export default async function RateStay({
  searchParams,
}: {
  searchParams: { bookingId?: string };
}) {
  const { bookingId } = searchParams;
  if (!bookingId) return notFound();

  const session = await getServerSession();

  const [booking, review] = await prisma.$transaction([
    prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: { include: { room_type: true } },
        guest: { select: { name: true, email: true } },
      },
    }),
    prisma.review.findFirst({ where: { bookingId } }),
  ]);
  if (!booking || booking.guestId !== session?.user?.id) return notFound();

  return (
    <PageContainer>
      <PageHeading
        title={`Rate Your Stay at Room No. ${booking.room.room_number}`}
        description="Rate your stay at our hotel, please review your stay with honesty to help us improve our customer's experience."
        backHref="/bookings"
        isSmall
        center
      />
      {new Date().getTime() > booking.check_out_at.getTime() ? (
        <ReviewForm bookingId={bookingId} />
      ) : (
        <p>You can rate this stay at {stringifyDate(booking.check_out_at)}</p>
      )}
      {!!review && <p>You have already reviewed this stay</p>}
    </PageContainer>
  );
}

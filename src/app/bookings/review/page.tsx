import PageContainer from "@/components/layout/PageContainer";
import PageHeading from "@/components/layout/PageHeading";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { getStayTimeInDays, stringifyDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import ReviewForm from "./components/form";

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
        title={`Rate Your Stay at ${booking.room.room_type.type_name} No. ${booking.room.room_number}`}
        description={`Tell us how you feel about your ${getStayTimeInDays(booking.check_in_at, booking.check_out_at)} day(s) stay at our ${booking.room.room_type.type_name} from ${stringifyDate(booking.check_in_at)} - ${stringifyDate(booking.check_out_at)}. Rate your stay at our hotel, please review your stay with honesty to help us improve our customer's experience.`}
        backHref="/bookings"
        isSmall
        center
      />
      {new Date().getTime() > booking.check_out_at.getTime() ? (
        <ReviewForm bookingId={bookingId} />
      ) : (
        <p className="text-center">
          You can rate this stay at {stringifyDate(booking.check_out_at)}
        </p>
      )}
      {!!review && (
        <p className="text-center">You have already reviewed this stay</p>
      )}
    </PageContainer>
  );
}

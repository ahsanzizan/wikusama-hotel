import PageContainer from "@/components/layout/PageContainer";
import prisma from "@/lib/prisma";
import BookingsTable from "./components/table";

export default async function Receptionist() {
  const bookings = await prisma.booking.findMany({
    include: {
      room: {
        select: {
          room_number: true,
          room_type: { select: { type_name: true, price_per_night: true } },
        },
      },
      guest: { select: { name: true } },
    },
  });

  return (
    <PageContainer>
      <div className="w-full">
        <div className="mb-12 w-full">
          <h1 className="mb-3">Guest&apos;Bookings</h1>
          <p>
            You can view room bookings and change the booking status after the
            stay is confirmed by the guest.
          </p>
        </div>
        <BookingsTable bookings={bookings} />
      </div>
    </PageContainer>
  );
}

import PageContainer from "@/components/layout/PageContainer";
import prisma from "@/lib/prisma";
import BookingsTable from "./components/table";
import PageHeading from "@/components/layout/PageHeading";

export default async function Receptionist() {
  const bookings = await prisma.booking.findMany({
    include: {
      room: {
        select: {
          room_number: true,
          room_type: { select: { type_name: true, price_per_night: true } },
        },
      },
      user: { select: { name: true } },
    },
  });

  return (
    <PageContainer>
      <div className="w-full">
        <PageHeading
          title="Guest's Bookings"
          description="You can view room bookings and change the booking status after the
            stay is confirmed by the guest."
          backHref="/"
        />
        <BookingsTable bookings={bookings} />
      </div>
    </PageContainer>
  );
}

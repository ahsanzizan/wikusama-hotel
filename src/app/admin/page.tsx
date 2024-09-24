import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { ReactNode } from "react";
import { FaBook, FaHotel, FaMoneyBill } from "react-icons/fa6";

export default async function AdminRoot() {
  const session = await getServerSession();
  const [bookings, rooms] = await prisma.$transaction([
    prisma.booking.findMany({
      select: {
        room: { select: { room_type: { select: { price_per_night: true } } } },
        check_in_at: true,
        check_out_at: true,
      },
    }),
    prisma.room.findMany({
      include: { bookings: { select: { check_out_at: true } } },
    }),
  ]);

  const totalRevenue = bookings.reduce((totalRevenue, booking) => {
    const price = booking.room?.room_type.price_per_night as number;
    const checkIn = new Date(booking.check_in_at);
    const checkOut = new Date(booking.check_out_at);

    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const daysStayed = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const bookingRevenue = daysStayed * price;

    return totalRevenue + bookingRevenue;
  }, 0);

  const availableRooms = rooms.reduce((availableRooms, room) => {
    const laterBookings = room.bookings.filter(
      (booking) => booking.check_out_at.getTime() > new Date().getTime(),
    );

    return laterBookings.length > 0 ? availableRooms : availableRooms + 1;
  }, 0);

  function StatsCard({
    icon,
    title,
    stats,
  }: {
    icon: ReactNode;
    title: string;
    stats: string;
  }) {
    return (
      <div className="flex items-center gap-5 rounded-lg border border-neutral-600 p-4">
        {icon}
        <div>
          <h3 className="mb-2">{title}</h3>
          <p>{stats}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-12">
        <h1 className="mb-3">
          Hello there, {session?.user?.name.split(" ")[0]}
        </h1>
        <p>
          Welcome to the Wikusama Hotel admin dashboard. You can view the sales
          statistics, manage receptionist accounts, manage rooms, and more.
        </p>
      </div>
      <div className="block">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
          <StatsCard
            icon={<FaMoneyBill className="size-10" />}
            title="Total Earnings"
            stats={"Rp. " + totalRevenue.toLocaleString("id-ID")}
          />
          <StatsCard
            icon={<FaBook className="size-10" />}
            title="Total Bookings"
            stats={bookings.length.toString()}
          />
          <StatsCard
            icon={<FaHotel className="size-10" />}
            title="Available Rooms"
            stats={availableRooms.toString()}
          />
        </div>
      </div>
    </>
  );
}

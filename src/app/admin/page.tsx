import BookingChart from "@/components/utils/BookingChart";
import RevenueChart from "@/components/utils/RevenueChart";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import {
  calculateRevenueGrowth,
  calculateUserGrowth,
  stringifyDate,
  toIDR,
} from "@/lib/utils";
import { BookingData, RevenueData } from "@/types/utils";
import { ReactNode } from "react";
import { FaBook, FaChartSimple, FaHotel, FaMoneyBill } from "react-icons/fa6";

export default async function AdminRoot() {
  const session = await getServerSession();
  const [bookings, rooms, users] = await prisma.$transaction([
    prisma.booking.findMany({
      select: {
        room: { select: { room_type: { select: { price_per_night: true } } } },
        check_in_at: true,
        check_out_at: true,
        booked_at: true,
      },
    }),
    prisma.room.findMany({
      include: { bookings: { select: { check_out_at: true } } },
    }),
    prisma.user.findMany({ select: { created_at: true } }),
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

  const bookingCounts = bookings.reduce<Record<string, number>>(
    (acc, booking) => {
      // Extract the booking date (formatted as YYYY-MM-DD)
      const bookingDate = stringifyDate(booking.booked_at);

      // Initialize or increment the count for this booking date
      acc[bookingDate] = (acc[bookingDate] || 0) + 1;

      return acc;
    },
    {},
  );

  const bookingData: BookingData[] = Object.keys(bookingCounts).map((date) => ({
    date,
    "Booking Count": bookingCounts[date],
  }));

  const revenuePerMonth = bookings.reduce<Record<string, number>>(
    (acc, booking) => {
      // Calculate the number of nights for each booking
      const nights =
        (new Date(booking.check_out_at).getTime() -
          new Date(booking.check_in_at).getTime()) /
        (1000 * 60 * 60 * 24);

      // Calculate the revenue for this booking
      const bookingRevenue = nights * booking.room.room_type.price_per_night;

      // Extract the booking month in the format 'YYYY-MM'
      const bookingMonth = new Date(booking.booked_at)
        .toISOString()
        .slice(0, 7); // e.g., '2024-09'

      // Sum the revenue per month
      if (!acc[bookingMonth]) {
        acc[bookingMonth] = bookingRevenue;
      } else {
        acc[bookingMonth] += bookingRevenue;
      }

      return acc;
    },
    {},
  );

  const revenueData: RevenueData[] = Object.keys(revenuePerMonth).map(
    (month) => ({
      month,
      Revenue: revenuePerMonth[month],
    }),
  );

  const revenueGrowth = calculateRevenueGrowth(revenueData) * 100;
  const usersGrowth = calculateUserGrowth(users);

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
          <p className="text-lg">{stats}</p>
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
      <div className="mb-12 block">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
          <StatsCard
            icon={<FaMoneyBill className="size-10" />}
            title="Total Earnings"
            stats={toIDR(totalRevenue)}
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
          <StatsCard
            icon={<FaChartSimple className="size-10" />}
            title="Revenue Growth (/month)"
            stats={`${revenueGrowth * 100}%`}
          />
          <StatsCard
            icon={<FaChartSimple className="size-10" />}
            title="User Growth (/month)"
            stats={`${usersGrowth * 100}%`}
          />
        </div>
      </div>
      <div className="flex flex-col items-center lg:flex-row">
        <div className="w-full">
          <h2 className="mb-2 w-full text-center">Bookings per-day Chart</h2>
          <BookingChart data={bookingData} />
        </div>
        <div className="w-full">
          <h2 className="mb-2 w-full text-center">Revenue per-month Chart</h2>
          <RevenueChart data={revenueData} />
        </div>
      </div>
    </>
  );
}

import PageContainer from "@/components/layout/PageContainer";
import SectionContainer from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { cn, getStayTime, stringifyDate } from "@/lib/utils";
import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";
import { FaArrowLeft, FaCalendar, FaClock } from "react-icons/fa6";

export default async function Bookings() {
  const session = await getServerSession();
  const bookings = await prisma.booking.findMany({
    where: { guest: { id: session?.user?.id } },
    include: {
      room: {
        select: {
          room_number: true,
          room_type: { select: { type_name: true, description: true } },
        },
      },
    },
    orderBy: { booked_at: "desc" },
  });

  function BookingCard({ booking }: { booking: (typeof bookings)[0] }) {
    return (
      <div className="flex w-full flex-col items-start justify-between gap-8 rounded-md bg-white px-7 py-5 text-black md:flex-row md:items-center md:gap-0">
        <div className="flex w-full items-center gap-5">
          <FaCalendar className="size-12 text-neutral-500" />
          <div className="block">
            <h2 className="mb-1">
              {booking.room.room_type.type_name} No. {booking.room.room_number}
            </h2>
            <p className="mb-4">{booking.room.room_type.description}</p>
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-2">
                <FaCalendarAlt />
                <p className="text-black">
                  {stringifyDate(booking.check_in_at)} -{" "}
                  {stringifyDate(booking.check_out_at)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FaClock />
                <p className="text-black">
                  {getStayTime(booking.check_in_at, booking.check_out_at)}{" "}
                  day(s) stay
                </p>
              </div>
            </div>
          </div>
        </div>
        <Link
          href={`/bookings/receipt?bookingId=${booking.id}`}
          className={buttonVariants({ variant: "default" })}
        >
          Download receipt
        </Link>
      </div>
    );
  }

  return (
    <PageContainer>
      <SectionContainer id="bookings" className="pt-0">
        <div className="w-full text-white">
          <div className="mb-12 flex items-center gap-8">
            <Link
              href={"/"}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "group w-fit",
              )}
            >
              <FaArrowLeft className="mr-1 transition-transform duration-300 group-hover:-translate-x-1" />{" "}
              Back
            </Link>
            <div className="block text-white">
              <h1 className="mb-3">
                Bookings History of {session?.user?.name}
              </h1>
              <p>
                You can view the booking details that you got from booking rooms
                in Wikusama Hotel.
              </p>
            </div>
          </div>
          {bookings.length === 0 && <p>There&apos;s no bookings...</p>}
          <div className="flex w-full flex-col gap-8 md:gap-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}

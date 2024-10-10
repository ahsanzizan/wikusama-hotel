import PageContainer from "@/components/layout/PageContainer";
import PageHeading from "@/components/layout/PageHeading";
import SectionContainer from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { cn, getStayTimeInDays, groupBy, stringifyDate } from "@/lib/utils";
import { Calendar, CalendarFold, Clock } from "lucide-react";
import Link from "next/link";

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

  const bookingsGroupByBookedAt = groupBy(bookings, ({ booked_at }) =>
    stringifyDate(booked_at),
  );
  const bookedAtKeys = Object.keys(bookingsGroupByBookedAt);

  function BookingCard({ booking }: { booking: (typeof bookings)[0] }) {
    return (
      <div className="flex w-full flex-col items-start justify-between gap-8 rounded-md bg-white px-7 py-5 text-black md:flex-row md:items-center md:gap-0">
        <div className="flex w-full items-center gap-5">
          <CalendarFold className="size-12 text-neutral-500" />
          <div className="block">
            <h2 className="mb-1">
              {booking.room.room_type.type_name} No. {booking.room.room_number}
            </h2>
            <p className="mb-4">{booking.room.room_type.description}</p>
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-2">
                <Calendar />
                <p className="text-black">
                  {stringifyDate(booking.check_in_at)} at 12:00 PM -{" "}
                  {stringifyDate(booking.check_out_at)} at 12:00 PM
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock />
                <p className="text-black">
                  {getStayTimeInDays(booking.check_in_at, booking.check_out_at)}{" "}
                  day(s) stay
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-fit md:flex-row">
          <Link
            href={`/bookings/receipt?bookingId=${booking.id}`}
            className={cn(
              buttonVariants({ variant: "default" }),
              "w-full md:w-fit",
            )}
          >
            Download receipt
          </Link>
          <Link
            href={`/bookings/review?bookingId=${booking.id}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full md:w-fit",
            )}
          >
            Rate stay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      <SectionContainer id="bookings" className="pt-0">
        <div className="w-full text-white">
          <PageHeading
            title={`Bookings History of ${session?.user?.name}`}
            description="You can view the booking details that you got from booking rooms
                in Wikusama Hotel."
            backHref="/"
          />
          <div className="block">
            <Link
              href={"/rooms"}
              className={buttonVariants({
                variant: "secondary",
                className: "mb-8",
              })}
            >
              Book now
            </Link>
            {bookings.length === 0 && <p>There&apos;s no bookings...</p>}
            <div className="flex w-full flex-col gap-10 divide-y divide-white md:gap-6">
              {bookedAtKeys.map((bookedAtKey) => (
                <div className="py-8" key={bookedAtKey}>
                  <h1 className="mb-12">{bookedAtKey}</h1>
                  <div className="flex w-full flex-col gap-8 md:gap-4">
                    {bookings
                      .filter(
                        (booking) =>
                          stringifyDate(booking.booked_at) === bookedAtKey,
                      )
                      .map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}

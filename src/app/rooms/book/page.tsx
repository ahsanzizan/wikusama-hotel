import PageContainer from "@/components/layout/PageContainer";
import PageHeading from "@/components/layout/PageHeading";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import BookingForm from "./components/form";
import { isISODateString } from "@/lib/utils";

export default async function BookRoom({
  searchParams,
}: {
  searchParams: { typeId: string; check_in?: string; check_out?: string };
}) {
  const { typeId, check_in, check_out } = searchParams;
  if (!typeId) return notFound();

  if (
    (check_in && !isISODateString(check_in)) ||
    (check_out && !isISODateString(check_out))
  )
    return notFound();

  const checkInDate = check_in ? new Date(check_in) : undefined;
  const checkOutDate = check_out ? new Date(check_out) : undefined;

  const [roomType, bookings, rooms] = await prisma.$transaction([
    prisma.room_type.findUnique({ where: { id: typeId } }),
    prisma.booking.findMany({
      select: {
        check_in_at: true,
        check_out_at: true,
        roomId: true,
        room: { select: { room_typeId: true } },
        booking_status: true,
      },
    }),
    prisma.room.findMany({ include: { bookings: true } }),
  ]);

  if (!roomType) return notFound();

  return (
    <PageContainer>
      <PageHeading
        title={`Booking ${roomType.type_name}`}
        description={`Facilities included: ${roomType.description}`}
        backHref="/rooms"
      />
      <div className="relative w-full pb-80">
        <Image
          src={roomType.photo}
          width={1272}
          height={512}
          alt={`Photo of ${roomType.type_name}`}
          unoptimized
          className="h-[512px] w-full rounded-lg object-cover"
        />
        <BookingForm
          roomType={roomType}
          bookings={bookings}
          rooms={rooms}
          checkIn={checkInDate}
          checkOut={checkOutDate}
        />
      </div>
    </PageContainer>
  );
}

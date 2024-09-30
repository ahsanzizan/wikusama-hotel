import PageContainer from "@/components/layout/PageContainer";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import BookingForm from "./components/form";

export default async function BookRoom({
  searchParams,
}: {
  searchParams: { typeId: string };
}) {
  const { typeId } = searchParams;
  if (!typeId) return notFound();

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
      <h1 className="mb-8">Booking {roomType.type_name}</h1>
      <div className="relative w-full pb-20">
        <Image
          src={roomType.photo}
          width={1272}
          height={512}
          alt={`Photo of ${roomType.type_name}`}
          unoptimized
          className="h-[512px] w-full rounded-lg object-cover"
        />
        <BookingForm roomType={roomType} bookings={bookings} rooms={rooms} />
      </div>
    </PageContainer>
  );
}

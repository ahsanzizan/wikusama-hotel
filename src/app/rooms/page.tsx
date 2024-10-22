import PageContainer from "@/components/layout/PageContainer";
import PageHeading from "@/components/layout/PageHeading";
import SectionContainer from "@/components/layout/SectionContainer";
import { Button, buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { cn, toIDR } from "@/lib/utils";
import { roomTypesWithRoomsCount } from "@/types/relations";
import Image from "next/image";
import Link from "next/link";

export default async function Rooms() {
  const roomTypes = await prisma.room_type.findMany({
    include: { rooms: { include: { bookings: true } } },
  });

  function RoomCard({ roomType }: { roomType: roomTypesWithRoomsCount }) {
    const isAvailable =
      roomType.rooms.filter((room) => room.is_available).length > 0;

    return (
      <div className="overflow-hidden rounded-md border border-neutral-700">
        <div className="relative">
          <Image
            src={roomType.photo}
            alt={roomType.type_name}
            width={330}
            height={285}
            className="h-[285px] w-full object-cover"
            unoptimized
          />
          <p className="absolute right-3 top-3 rounded-md bg-white px-4 py-2 text-black">
            {isAvailable ? "Available" : "Unavailable"}
          </p>
        </div>
        <div className="p-5 text-center text-white">
          <div className="mb-3 flex w-full flex-col items-start justify-between gap-1">
            <h3>{roomType.type_name}</h3>
            <p>{toIDR(roomType.price_per_night)}/night</p>
          </div>
          <p className="mb-8 text-justify text-neutral-500">
            {roomType.description}
          </p>
          {isAvailable ? (
            <Link
              href={`/rooms/book?typeId=${roomType.id}`}
              className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            >
              Book
            </Link>
          ) : (
            <Button variant={"secondary"} className="w-full" disabled>
              Unavailable
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      <SectionContainer id="rooms" className="pt-0">
        <div className="w-full">
          <PageHeading
            title="Luxurious Rooms"
            description="All rooms are designed to make your stay as comfortable as possible."
            backHref="/"
          />
          {roomTypes.length > 0 ? (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-10">
              {roomTypes.map((roomType) => (
                <RoomCard key={roomType.id} roomType={roomType} />
              ))}
            </div>
          ) : (
            <p className="text-center">There&apos;s no room to view...</p>
          )}
        </div>
      </SectionContainer>
    </PageContainer>
  );
}

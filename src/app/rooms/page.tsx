import PageContainer from "@/components/layout/PageContainer";
import SectionContainer from "@/components/layout/SectionContainer";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { roomTypesWithRoomsCount } from "@/types/relations";

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
          <h3 className="mb-3">{roomType.type_name}</h3>
          <p className="mb-8 text-neutral-500">{roomType.description}</p>
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
              <h1 className="mb-3">Luxurious Rooms</h1>
              <p>
                All rooms are designed to make your stay as comfortable as
                possible.
              </p>
            </div>
          </div>
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

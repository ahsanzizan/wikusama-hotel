import SectionContainer from "@/components/layout/SectionContainer";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, toIDR } from "@/lib/utils";
import { roomTypesWithRoomsCount } from "@/types/relations";
import Image from "next/image";
import Link from "next/link";

function RoomCard({ roomType }: { roomType: roomTypesWithRoomsCount }) {
  const isAvailable =
    roomType.rooms.filter((room) => room.is_available).length > 0;

  return (
    <div className="overflow-hidden rounded-md border border-neutral-300">
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
      <div className="p-5">
        <div className="mb-3 flex w-full flex-col items-start justify-between gap-1">
          <h3>{roomType.type_name}</h3>
          <div className="flex items-center gap-2">
            <p
              className={cn(
                roomType.discount_percent > 0 && "text-xs line-through",
              )}
            >
              {toIDR(roomType.price_per_night)}/night
            </p>
            {roomType.discount_percent > 0 && (
              <p className="rounded-lg bg-black px-2 py-1 text-xs">
                {roomType.discount_percent}% off
              </p>
            )}
          </div>
          {roomType.discount_percent > 0 && (
            <p>
              {toIDR(
                roomType.price_per_night -
                  roomType.price_per_night * (roomType.discount_percent / 100),
              )}
              /night
            </p>
          )}
        </div>
        <p className="mb-8 text-justify text-neutral-500">
          {roomType.description}
        </p>
        {isAvailable ? (
          <Link
            href={`/rooms/book?typeId=${roomType.id}`}
            className={cn(buttonVariants({ variant: "default" }), "w-full")}
          >
            Book
          </Link>
        ) : (
          <Button variant={"default"} className="w-full" disabled>
            Unavailable
          </Button>
        )}
      </div>
    </div>
  );
}

export function Rooms({ roomTypes }: { roomTypes: roomTypesWithRoomsCount[] }) {
  return (
    <SectionContainer id="rooms">
      <div className="w-full bg-white px-5 py-16 text-black">
        <div className="mb-12 w-full text-center">
          <h1 className="mb-3">Luxurious Rooms</h1>
          <p className="mb-8">
            All rooms are designed to make your stay as comfortable as possible.
          </p>
          <Link
            href={"/rooms"}
            className={buttonVariants({ variant: "default" })}
          >
            See more
          </Link>
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
  );
}

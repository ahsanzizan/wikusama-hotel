"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, toIDR } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type roomTypeWithRoomsAndBookings = Prisma.room_typeGetPayload<{
  include: { rooms: { include: { bookings: true } } };
}>;

function RoomTypeCard({
  roomType,
}: {
  roomType: roomTypeWithRoomsAndBookings;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-5 overflow-hidden rounded-lg bg-white text-black md:flex-row">
      <Image
        src={roomType.photo}
        alt={roomType.type_name}
        width={350}
        height={120}
        unoptimized
        className="w-full md:h-full md:w-1/2"
      />
      <div className="block p-4">
        <h2 className="mb-1">{roomType.type_name}</h2>
        <p className="mb-8 text-sm text-neutral-400">{roomType.description}</p>
        <div className="mb-3 flex flex-row items-start justify-between md:flex-col md:items-start md:justify-normal md:gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h4
                className={cn(
                  roomType.discount_percent > 0 &&
                    "text-xs text-neutral-400 line-through",
                )}
              >
                {toIDR(roomType.price_per_night)}/night
              </h4>
              {roomType.discount_percent > 0 && (
                <h4 className="rounded-lg bg-black px-2 py-1 text-xs text-white">
                  {roomType.discount_percent}% off
                </h4>
              )}
            </div>
            {roomType.discount_percent > 0 && (
              <h4>
                {toIDR(
                  roomType.price_per_night -
                    roomType.price_per_night *
                      (roomType.discount_percent / 100),
                )}
                /night
              </h4>
            )}
          </div>
          <p className="rounded-full border border-black px-3 py-1 text-sm text-black">
            {roomType.rooms.length} available
          </p>
        </div>
        <Link
          href={`/rooms/book?typeId=${roomType.id}`}
          className={buttonVariants({
            variant: "default",
            className: "w-full",
          })}
        >
          Book now
        </Link>
      </div>
    </div>
  );
}

export default function Filter({
  checkIn: presetCheckIn,
  checkOut: presetCheckOut,
  availableRooms,
}: {
  checkIn: Date;
  checkOut: Date;
  availableRooms: roomTypeWithRoomsAndBookings[];
}) {
  const [checkIn, setCheckIn] = useState<Date | undefined>(presetCheckIn);
  const [checkOut, setCheckOut] = useState<Date | undefined>(presetCheckOut);
  const [filteredRooms, setFilteredRooms] = useState<
    roomTypeWithRoomsAndBookings[]
  >([]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const roomsInRange = availableRooms.filter((roomType) =>
        roomType.rooms.some((room) => {
          return (
            room.is_available &&
            room.bookings.every(
              (booking) =>
                booking.check_out_at <= checkIn ||
                booking.check_in_at >= checkOut,
            )
          );
        }),
      );

      setFilteredRooms(
        roomsInRange.map((roomType) => ({
          ...roomType,
          // Mutate the 'rooms' property to contain only the available rooms
          rooms: roomType.rooms.filter((room) => {
            return (
              room.is_available &&
              room.bookings.every(
                (booking) =>
                  booking.check_out_at <= checkIn ||
                  booking.check_in_at >= checkOut,
              )
            );
          }),
        })),
      );
    }
  }, [checkIn, checkOut, availableRooms]);

  useEffect(() => {
    if (checkIn && checkOut) {
      setCheckOut(checkIn >= checkOut ? addDays(checkIn, 1) : checkOut);
    }
  }, [checkIn, checkOut]);

  return (
    <div className="w-full" id="search">
      <div className="mb-12 flex w-full items-center gap-3 md:w-[80%]">
        <div className="w-full md:w-[45%]">
          <h5 className="mb-1 text-start">Check-in Date</h5>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  checkIn && "text-muted-foreground",
                )}
              >
                {checkIn ? format(checkIn, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={(e) => {
                  setCheckIn(e);
                }}
                disabled={(date) => {
                  return date < addDays(new Date(), -1);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-full md:w-[45%]">
          <h5 className="mb-1 text-start">Check-out Date</h5>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  checkOut && "text-muted-foreground",
                )}
              >
                {checkOut ? format(checkOut, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={(e) => {
                  setCheckOut(e);
                }}
                disabled={(date) => {
                  return (checkIn && date <= checkIn) || date < new Date();
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {filteredRooms.map((roomType) => (
          <RoomTypeCard key={roomType.id} roomType={roomType} />
        ))}
      </div>
    </div>
  );
}

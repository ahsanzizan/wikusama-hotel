import PageContainer from "@/components/layout/PageContainer";
import SectionContainer from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { RoomTypesWithRoomsCount } from "@/types/relations";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { FaParking, FaSwimmer } from "react-icons/fa";
import {
  FaBowlFood,
  FaBuilding,
  FaCalendar,
  FaDumbbell,
  FaGamepad,
  FaJugDetergent,
  FaLightbulb,
  FaLocationPin,
  FaPlay,
  FaUser,
  FaWifi,
} from "react-icons/fa6";

function Hero() {
  return (
    <SectionContainer id="hero">
      <div className="relative flex w-full flex-col items-start justify-between gap-14 md:flex-row md:gap-0">
        <div className="flex max-w-full flex-col gap-[34px] md:mt-12 md:max-w-[50%]">
          <div className="block">
            <h3 className="mb-[26px] w-fit rounded-sm bg-white px-2 py-1 text-black">
              Wikusama Hotel
            </h3>
            <h1 className="display mb-[14px]">
              Hotel for every moment rich in emotion
            </h1>
            <p>
              Every moment feels like the first time in Wikusama Hotel. Enjoy
              every bit of your stay with fresh moments everytime.
            </p>
          </div>
          <div className="flex items-center gap-7">
            <Link
              href={"/rooms"}
              className={buttonVariants({ variant: "secondary" })}
            >
              Book now
            </Link>
            <Link
              href={"/rooms/tour"}
              className={cn("group flex items-center gap-3")}
            >
              <span className={cn("rounded-full")}>
                <FaPlay className="size-7" />
              </span>
              Take a tour
            </Link>
          </div>
        </div>
        <div className="max-w-full md:max-w-[40%]">
          <Image
            src={"/hero.jpg"}
            width={626}
            height={700}
            alt="Hero image"
            className="h-[550px] w-full object-cover"
          />
        </div>
        <div className="absolute bottom-16 left-0 hidden w-full lg:block">
          <div className="flex w-full flex-col items-start justify-between gap-2 bg-black px-8 py-10 md:flex-row md:items-center md:gap-0">
            <div className="flex items-start gap-2">
              <FaLocationPin />
              <p>Various Locations</p>
            </div>
            <div className="flex items-start gap-2">
              <FaBuilding />
              <p>Various Rooms</p>
            </div>
            <div className="flex items-start gap-2">
              <FaUser />
              <p>Various Bed Sizes</p>
            </div>
            <div className="flex items-start gap-2">
              <FaCalendar />
              <p>Flexible Check-in</p>
            </div>
            <div className="flex items-start gap-2">
              <FaCalendar />
              <p>Flexible Check-out</p>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

function Facilities() {
  function FacilityDisplay({
    icon,
    facilityTitle,
  }: {
    icon: ReactNode;
    facilityTitle: string;
  }) {
    return (
      <div className="flex flex-col items-center gap-5 px-16 py-10">
        {icon}
        <p className="text-center">{facilityTitle}</p>
      </div>
    );
  }

  const facilities = [
    { icon: <FaSwimmer className="size-10" />, title: "Swimming Pool" },
    { icon: <FaWifi className="size-10" />, title: "WiFi" },
    { icon: <FaBowlFood className="size-10" />, title: "Breakfast and Lunch" },
    { icon: <FaDumbbell className="size-10" />, title: "Gym Center" },
    { icon: <FaGamepad className="size-10" />, title: "Game Center" },
    { icon: <FaLightbulb className="size-10" />, title: "24/7 Light" },
    { icon: <FaJugDetergent className="size-10" />, title: "Laundry" },
    { icon: <FaParking className="size-10" />, title: "Parking Space" },
  ];

  return (
    <SectionContainer id="facilities">
      <div className="mb-12 w-full text-center">
        <h1 className="mb-3">Our Facilities</h1>
        <p>We offer modern 5 stars hotel facilities for your content.</p>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-x-4">
        {facilities.map((facility, index) => (
          <FacilityDisplay
            key={index}
            icon={facility.icon}
            facilityTitle={facility.title}
          />
        ))}
      </div>
    </SectionContainer>
  );
}

function Rooms({ roomTypes }: { roomTypes: RoomTypesWithRoomsCount[] }) {
  function RoomCard({ roomType }: { roomType: RoomTypesWithRoomsCount }) {
    return (
      <div className="rounded-md border border-neutral-300 p-7">
        <div className="relative mb-4">
          <Image
            src={roomType.photo}
            alt={roomType.type_name}
            width={330}
            height={285}
            className="h-full max-h-[285px] w-full"
            unoptimized
          />
          <p className="absolute right-3 top-3 rounded-md bg-white px-4 py-2 text-black">
            {roomType.rooms.filter((room) =>
              room.bookings.find(
                (booking) =>
                  new Date().getTime() > booking.check_out_at.getTime(),
              ),
            ).length > 0
              ? "Available"
              : "Unavailable"}
          </p>
        </div>
        <div className="text-center">
          <h3 className="mb-3">{roomType.type_name}</h3>
          <p>{roomType.description}</p>
        </div>
      </div>
    );
  }

  return (
    <SectionContainer id="rooms">
      <div className="w-full bg-white px-5 py-16 text-black">
        <div className="mb-12 w-full text-center">
          <h1 className="mb-3">Luxurious Rooms</h1>
          <p className="mb-5">
            All rooms are designed to make your stay as comfortable as possible.
          </p>
          <Link
            href={"/rooms"}
            className={buttonVariants({ variant: "default" })}
          >
            See more
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-10">
          {roomTypes.map((roomType) => (
            <RoomCard key={roomType.id} roomType={roomType} />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}

export default async function Home() {
  const roomTypes = await prisma.room_type.findMany({
    include: { rooms: { select: { id: true, bookings: true }, take: 3 } },
  });

  return (
    <PageContainer>
      <Hero />
      <Facilities />
      <Rooms roomTypes={roomTypes} />
    </PageContainer>
  );
}

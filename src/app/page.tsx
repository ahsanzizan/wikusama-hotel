import PageContainer from "@/components/layout/PageContainer";
import SectionContainer from "@/components/layout/SectionContainer";
import { Button, buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { cn, stringifyDate } from "@/lib/utils";
import { roomTypesWithRoomsCount } from "@/types/relations";
import { review } from "@prisma/client";
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
  FaQuoteLeft,
  FaStar,
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
              Hotel For Every Moment Rich in Emotion
            </h1>
            <p>
              Every moment feels like the first time in Wikusama Hotel. Enjoy
              every bit of your stay with fresh moments everytime.
            </p>
          </div>
          <div className="flex items-center gap-7">
            <Link
              href={"#rooms"}
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
      <div className="flex flex-col items-center gap-5 rounded-md px-16 py-10 transition-all duration-300 hover:bg-white hover:text-black">
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

function Rooms({ roomTypes }: { roomTypes: roomTypesWithRoomsCount[] }) {
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
        <div className="p-5 text-center">
          <h3 className="mb-3">{roomType.type_name}</h3>
          <p className="mb-8 text-neutral-500">{roomType.description}</p>
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

function Testimonies({ reviews }: { reviews: review[] }) {
  function TestimonyCard({
    testimony,
    date,
    name,
    rate,
  }: {
    testimony: string;
    date: Date;
    name: string;
    rate: number;
  }) {
    return (
      <div className="rounded-lg border border-neutral-500 px-8 py-7">
        <div className="mb-16 flex items-center justify-between">
          <p>
            <time dateTime={date.toDateString()}>{stringifyDate(date)}</time>
          </p>
          <div className="flex items-center gap-1">
            {Array.from({ length: rate }).map((_, index) => (
              <FaStar key={index} />
            ))}
          </div>
        </div>
        <p className="mb-7 leading-5">
          <FaQuoteLeft className="mb-1" />
          {testimony}
        </p>
        <div className="flex items-center gap-4">
          <p className="text-lg font-medium text-white">{name}</p>
        </div>
      </div>
    );
  }

  return (
    <SectionContainer id="testimonies">
      <div className="mb-12 w-full text-center">
        <h1 className="mb-3">Testimonies</h1>
        <p>We made sure our clients satisfied with our service.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
        {reviews.map((review) => (
          <TestimonyCard
            key={review.id}
            name={review.guest_name}
            date={review.submitted_at}
            testimony={review.testimony}
            rate={review.rate}
          />
        ))}
      </div>
    </SectionContainer>
  );
}

export default async function Home() {
  const [roomTypes, reviews] = await prisma.$transaction([
    prisma.room_type.findMany({
      include: { rooms: { include: { bookings: true } } },
      take: 3,
    }),
    prisma.review.findMany({ take: 3 }),
  ]);

  return (
    <PageContainer>
      <Hero />
      <Facilities />
      <Rooms roomTypes={roomTypes} />
      <Testimonies reviews={reviews} />
    </PageContainer>
  );
}

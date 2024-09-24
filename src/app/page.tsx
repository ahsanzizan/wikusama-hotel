import PageContainer from "@/components/layout/PageContainer";
import SectionContainer from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { cn, stringifyDate } from "@/lib/utils";
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

function Testimonies() {
  const testimonies = [
    {
      testimony:
        "My stay at Wikusama Hotel was nothing short of extraordinary. From the moment I arrived, the staff made me feel incredibly welcome. The room was impeccably clean and offered a stunning view of the city. Every detail, from the comfort of the bed to the quality of room service, was meticulously cared for. I will definitely be returning to Wikusama Hotel for my next trip!",
      date: new Date("12 August 2023"),
      name: "John Doe",
      photo:
        "https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      testimony:
        "Wikusama Hotel exceeded all of my expectations! The hospitality was world-class, and the facilities were top-notch. I particularly enjoyed the luxurious spa and the gourmet dining options available on-site. The hotel is located in a prime spot, making it easy to explore nearby attractions. This was the perfect retreat after a long day of sightseeing, and I can’t recommend it highly enough.",
      date: new Date("15 August 2023"),
      name: "Jane Smith",
      photo:
        "https://plus.unsplash.com/premium_photo-1664541336692-e931d407ba88?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      testimony:
        "Staying at Wikusama Hotel was an unforgettable experience. The staff went above and beyond to make sure I had everything I needed. The rooms were spacious, beautifully decorated, and very comfortable. I loved the attention to detail, from the welcome drink to the personalized notes left in my room. It felt like a home away from home, and I would highly recommend it to anyone visiting the area.",
      date: new Date("20 August 2023"),
      name: "Michael Brown",
      photo:
        "https://plus.unsplash.com/premium_photo-1675130119373-61ada6685d63?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  function TestimonyCard({
    testimony,
    date,
    name,
    photo,
  }: {
    testimony: string;
    date: Date;
    name: string;
    photo: string;
  }) {
    return (
      <div className="rounded-lg border border-neutral-500 px-8 py-7">
        <div className="mb-16 flex items-center justify-between">
          <p>
            <time dateTime={date.toDateString()}>{stringifyDate(date)}</time>
          </p>
          <div className="flex items-center gap-1">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>
        </div>
        <p className="mb-7 leading-5">
          <FaQuoteLeft className="mb-1" />
          {testimony}
        </p>
        <div className="flex items-center gap-4">
          <Image
            src={photo}
            width={42}
            height={42}
            alt={`Photo of ${name}`}
            className="size-11 rounded-full object-cover"
            unoptimized
          />
          <p className="text-white">{name}</p>
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
        {testimonies.map((testimony, index) => (
          <TestimonyCard key={index} {...testimony} />
        ))}
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
      <Testimonies />
    </PageContainer>
  );
}

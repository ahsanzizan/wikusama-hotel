import PageContainer from "@/components/layout/PageContainer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  FaBuilding,
  FaCalendar,
  FaLocationPin,
  FaPlay,
  FaUser,
} from "react-icons/fa6";

export default function Home() {
  return (
    <PageContainer>
      <div className="relative flex w-full flex-col items-start justify-between gap-14 md:flex-row md:items-center md:gap-0">
        <div className="flex max-w-full flex-col gap-[34px] md:max-w-[50%]">
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
        <div className="absolute bottom-6 left-0 hidden w-full lg:block">
          <div className="flex w-full flex-col items-start justify-between gap-2 bg-black px-8 py-6 md:flex-row md:items-center md:gap-0">
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
    </PageContainer>
  );
}

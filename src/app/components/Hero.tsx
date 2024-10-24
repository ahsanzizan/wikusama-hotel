import SectionContainer from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Building,
  CalendarArrowDown,
  CalendarArrowUp,
  LocateFixed,
  Play,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
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
                <Play className="size-7" />
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
              <LocateFixed />
              <p>Various Locations</p>
            </div>
            <div className="flex items-start gap-2">
              <Building />
              <p>Various Rooms</p>
            </div>
            <div className="flex items-start gap-2">
              <User />
              <p>Various Bed Sizes</p>
            </div>
            <div className="flex items-start gap-2">
              <CalendarArrowUp />
              <p>Flexible Check-in</p>
            </div>
            <div className="flex items-start gap-2">
              <CalendarArrowDown />
              <p>Flexible Check-out</p>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

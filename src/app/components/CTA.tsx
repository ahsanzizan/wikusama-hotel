"use client";
import SectionContainer from "@/components/layout/SectionContainer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function CTA() {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();

  return (
    <SectionContainer id="cta">
      <div className="relative flex w-full items-center justify-center px-10 py-20 text-white">
        <div className="w-full max-w-xl text-center">
          <h1 className="mb-4">
            Plan an Unforgettable Experience in Wikusama Hotel Today!
          </h1>
          <p className="mb-6">
            We can help you fit your stay and experience within your allotted
            budget
          </p>

          <div className="mb-8 flex w-full flex-col items-center justify-between gap-2 rounded-md bg-white p-4 text-black md:flex-row md:gap-0">
            <div className="flex w-full items-center gap-1 md:w-[80%]">
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
                      {checkIn ? (
                        format(checkIn, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
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
                      {checkOut ? (
                        format(checkOut, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
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
                        return (
                          (checkIn && date <= checkIn) || date < new Date()
                        );
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Link
              href={
                checkIn && checkOut
                  ? `/rooms/available-rooms?check_in=${checkIn?.toISOString()}&check_out=${checkOut?.toISOString()}`
                  : "/rooms"
              }
              className={buttonVariants({
                variant: "default",
                className: "w-full md:w-fit",
              })}
            >
              Book now
            </Link>
          </div>
        </div>
        <Image
          src={"/room-sample.jpg"}
          alt="CTA Image"
          width={1168}
          height={512}
          className="absolute left-0 top-0 -z-10 h-full w-full object-cover opacity-30"
        />
      </div>
    </SectionContainer>
  );
}

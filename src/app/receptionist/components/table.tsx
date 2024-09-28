"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, getStayTime, stringifyDate, toIDR } from "@/lib/utils";
import { BookingStatus, Prisma } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { updateBookingStatus } from "../actions";

const filterBookings = (
  bookings: bookingWithRoomAndRoomType[],
  bookingDateFilter?: Date,
  stayTimeFilter?: DateRange,
) => {
  // Helper function to compare dates
  const compareDates = (date1: Date, date2: Date) =>
    stringifyDate(date1) === stringifyDate(date2);

  // If only bookingDateFilter is provided
  if (bookingDateFilter && !stayTimeFilter?.to) {
    return bookings.filter((booking) =>
      compareDates(booking.booked_at, bookingDateFilter),
    );
  }

  // If stayTimeFilter is provided
  if (stayTimeFilter?.from && stayTimeFilter?.to) {
    if (bookingDateFilter)
      return bookings.filter((booking) => {
        const bookedAtMatches = compareDates(
          booking.booked_at,
          bookingDateFilter,
        );
        const stayTimeMatches =
          compareDates(booking.check_in_at, stayTimeFilter.from!) &&
          compareDates(booking.check_out_at, stayTimeFilter!.to!);

        return bookedAtMatches && stayTimeMatches;
      });

    return bookings.filter((booking) => {
      const stayTimeMatches =
        compareDates(booking.check_in_at, stayTimeFilter.from!) &&
        compareDates(booking.check_out_at, stayTimeFilter!.to!);

      return stayTimeMatches;
    });
  }

  // If no conditions match, return all bookings
  return bookings;
};

type bookingWithRoomAndRoomType = Prisma.bookingGetPayload<{
  include: {
    room: {
      select: {
        room_number: true;
        room_type: { select: { type_name: true; price_per_night: true } };
      };
    };
    guest: { select: { name: true } };
  };
}>;

export default function BookingsTable({
  bookings,
}: {
  bookings: bookingWithRoomAndRoomType[];
}) {
  const [tableLoading, setTableLoading] = useState(true);
  const [bookingDateFilter, setBookingDateFilter] = useState<Date>();
  const [stayTimeFilter, setStayTimeFilter] = useState<DateRange>();
  const router = useRouter();

  const columns: TableColumn<bookingWithRoomAndRoomType>[] = [
    {
      name: "#",
      selector: (_, i) => i! + 1,
      sortable: true,
    },
    {
      name: "Guest",
      selector: (row) => row.guest.name,
      sortable: true,
    },
    {
      name: "Check-in Date",
      selector: (row) => stringifyDate(row.check_in_at),
      sortable: true,
    },
    {
      name: "Check-out Date",
      selector: (row) => stringifyDate(row.check_out_at),
      sortable: true,
    },
    {
      name: "Night(s) Count",
      selector: (row) => getStayTime(row.check_in_at, row.check_out_at),
      sortable: false,
    },
    {
      name: "Room No.",
      selector: (row) => row.room.room_number,
      sortable: false,
    },
    {
      name: "Room Type",
      selector: (row) => row.room.room_type.type_name,
      sortable: true,
    },
    {
      name: "Booking Date",
      selector: (row) => stringifyDate(row.booked_at),
      sortable: true,
    },
    {
      name: "Pay",
      selector: (row) =>
        toIDR(
          getStayTime(row.check_in_at, row.check_out_at) *
            row.room.room_type.price_per_night,
        ),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <Select
          onValueChange={async (value: BookingStatus) => {
            const toastId = toast.loading("Loading...");
            await updateBookingStatus(row.id, value);
            toast.success("Updated booking status!", { id: toastId });
            return router.refresh();
          }}
          defaultValue={row.booking_status}
        >
          <SelectTrigger className="border border-neutral-300">
            <SelectValue placeholder="Select a room type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"CONFIRMED"}>CONFIRMED</SelectItem>
            <SelectItem value={"PENDING"}>PENDING</SelectItem>
            <SelectItem value={"CANCELLED"}>CANCELLED</SelectItem>
          </SelectContent>
        </Select>
      ),
      sortable: true,
    },
  ];

  useEffect(() => {
    setTableLoading(false);
  }, []);

  if (tableLoading) return <p>Loading...</p>;

  return (
    <div className="block">
      <div className="mb-12 flex flex-col items-start gap-5 md:flex-row md:items-center">
        <div className="w-fit">
          <p className="mb-2 text-white">Filter by booking date</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !bookingDateFilter && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {bookingDateFilter ? (
                  format(bookingDateFilter, "PPP")
                ) : (
                  <span className="text-neutral-400">Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={bookingDateFilter}
                onSelect={setBookingDateFilter}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-fit">
          <p className="mb-2 text-white">Filter by stay time</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !stayTimeFilter && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {stayTimeFilter?.from ? (
                  stayTimeFilter.to ? (
                    <>
                      {format(stayTimeFilter.from, "LLL dd, y")} -{" "}
                      {format(stayTimeFilter.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(stayTimeFilter.from, "LLL dd, y")
                  )
                ) : (
                  <span className="text-neutral-400">Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={stayTimeFilter?.from}
                selected={stayTimeFilter}
                onSelect={setStayTimeFilter}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filterBookings(bookings, bookingDateFilter, stayTimeFilter)}
        pagination
        highlightOnHover
      />
    </div>
  );
}

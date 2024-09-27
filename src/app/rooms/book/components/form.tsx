"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useZodForm } from "@/hooks/useZodForm";
import { cn, getAllBookedDates, getAvailableRooms } from "@/lib/utils";
import { roomsWithBookings } from "@/types/relations";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { bookRooms } from "../actions";
import { redirect } from "next/navigation";

function createBookingSchema() {
  const bookingSchema = z.object({
    room_count: z.string().min(1, "Room count must be at least 1!"),
    check_in_at: z.date({ required_error: "Check-in date must be filled!" }),
    check_out_at: z.date({ required_error: "Check-out date must be filled!" }),
  });

  return bookingSchema;
}

export default function BookingForm({
  typeId,
  bookings,
  rooms,
}: {
  typeId: string;
  bookings: { check_in_at: Date; check_out_at: Date; roomId: string }[];
  rooms: roomsWithBookings[];
}) {
  const [loading, setLoading] = useState(false);
  const form = useZodForm({
    schema: createBookingSchema(),
  });
  const [availableRooms, setAvailableRooms] = useState<roomsWithBookings[]>();

  const bookedDates = getAllBookedDates(bookings);
  const checkInDate = form.watch("check_in_at");
  const checkOutDate = form.watch("check_out_at");
  const roomCount = form.watch("room_count");

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const availableRooms = getAvailableRooms({
        bookings,
        rooms,
        start: checkInDate,
        end: checkOutDate,
        typeId,
      });
      setAvailableRooms(availableRooms);
    }
  }, [bookings, checkInDate, checkOutDate, rooms, typeId]);

  useEffect(() => {
    if (availableRooms) {
      if (Number(roomCount) > availableRooms.length) {
        form.setValue("room_count", availableRooms.length.toString());
      } else if (Number(roomCount) < 0) {
        form.setValue("room_count", (0).toString());
      }
    }
  }, [availableRooms, form, roomCount]);

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const toastId = toast.loading("Loading...");
    const result = await bookRooms({
      availableRoomIds: availableRooms!.map((room) => room.id),
      check_in_at: values.check_in_at,
      check_out_at: values.check_out_at,
    });

    if (!result.success) {
      setLoading(false);
      return toast.error(result.message, { id: toastId });
    }

    toast.success(result.message, { id: toastId });
    setLoading(false);
    return redirect("/bookings");
  });

  return (
    <Card className="absolute bottom-0 left-1/2 w-full max-w-lg -translate-x-1/2 border-none">
      <CardHeader>
        <CardTitle className="mb-3">
          You&apos;re on your way to book the Queen&apos;s Room
        </CardTitle>
        <CardDescription>
          Please pick a check in and check out date for us to check this
          type&apos;s rooms availability.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid w-full items-center gap-y-4">
              <FormField
                control={form.control}
                name="check_in_at"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-in date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            return (
                              date < addDays(new Date(), -1) ||
                              bookedDates.includes(date)
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="check_out_at"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-out date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            return (
                              date <= form.getValues("check_in_at") ||
                              date <= new Date() ||
                              bookedDates.includes(date)
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="room_count"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="room_count">
                      Room count{" "}
                      {availableRooms
                        ? `(${availableRooms.length} Available Rooms)`
                        : ""}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={"number"}
                        max={availableRooms ? availableRooms.length : 0}
                        min={1}
                        disabled={!availableRooms?.length}
                        placeholder="Room count"
                      />
                    </FormControl>
                    {!availableRooms && (
                      <FormDescription>
                        Pick a check-in and check-out date first!
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-4 flex w-full flex-col items-center gap-4">
                <Button
                  type="submit"
                  variant={"default"}
                  className="w-full"
                  disabled={loading}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
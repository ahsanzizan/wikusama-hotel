import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
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
import { cn, getStayTimeInDays, stringifyDate, toIDR } from "@/lib/utils";
import { roomsWithBookings } from "@/types/relations";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

export function EssentialsForm({
  form,
  bookedDates,
  availableRooms,
  price_per_night,
}: {
  form: UseFormReturn<{
    room_count: string;
    check_in_at: Date;
    check_out_at: Date;
    guest_full_name: string;
    guest_email: string;
    guest_phone_number: string;
    guest_address: string;
  }>;
  bookedDates: Date[];
  availableRooms?: roomsWithBookings[];
  price_per_night: number;
}) {
  return (
    <>
      <h4>Essential Data</h4>
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
                      bookedDates
                        .map((bookedDate) => stringifyDate(bookedDate))
                        .includes(stringifyDate(date))
                    );
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
            <FormDescription>
              Disabled dates are either already booked or unavailable
            </FormDescription>
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
                      bookedDates
                        .map((bookedDate) => stringifyDate(bookedDate))
                        .includes(stringifyDate(date))
                    );
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
            <FormDescription>
              Disabled dates are either already booked or unavailable
            </FormDescription>
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
            {availableRooms ? (
              <FormDescription>
                Total:{" "}
                <span className="font-bold">
                  {toIDR(
                    form.getValues("room_count")
                      ? price_per_night *
                          getStayTimeInDays(
                            form.getValues("check_in_at"),
                            form.getValues("check_out_at"),
                          ) *
                          Number(form.getValues("room_count"))
                      : 0,
                  )}
                </span>
              </FormDescription>
            ) : (
              <FormDescription>
                Pick a check-in and check-out date first!
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

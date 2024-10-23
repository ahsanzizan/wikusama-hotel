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
import {
  cn,
  getAllBookedDates,
  getAvailableRooms,
  getStayTimeInDays,
  stringifyDate,
  toIDR,
} from "@/lib/utils";
import { roomsWithBookings } from "@/types/relations";
import { BookingStatus } from "@prisma/client";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import validator from "validator";
import { z } from "zod";
import { bookRooms, payBookings } from "../actions";

function createBookingSchema() {
  const bookingSchema = z.object({
    room_count: z.string().min(1, "Room count must be at least 1!"),
    check_in_at: z.date({ required_error: "Check-in date must be filled!" }),
    check_out_at: z.date({ required_error: "Check-out date must be filled!" }),
    guest_full_name: z.string().min(1, "Guest's full name must be filled!"),
    guest_email: z
      .string()
      .email("Email format is not valid!")
      .min(1, "Guest's email must be filled!"),
    guest_phone_number: z
      .string()
      .refine(validator.isMobilePhone, "Phone number format is incorrect"),
    guest_address: z.string().min(1, "Guest's address must be filled!"),
  });

  return bookingSchema;
}

function EssentialsForm({
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

function GuestForm({
  form,
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
}) {
  return (
    <>
      <h4>Guest Data</h4>
      <FormField
        control={form.control}
        name="guest_full_name"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-1.5">
            <FormLabel htmlFor="guest_full_name">Fullname</FormLabel>
            <FormControl>
              <Input {...field} placeholder="The guest's fullname" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="guest_email"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-1.5">
            <FormLabel htmlFor="guest_email">Email</FormLabel>
            <FormControl>
              <Input {...field} placeholder="The guest's email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="guest_phone_number"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-1.5">
            <FormLabel htmlFor="guest_phone_number">
              Phone Number (08xxxxxxxxxx)
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="The guest's phone number" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="guest_address"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-1.5">
            <FormLabel htmlFor="guest_address">Address</FormLabel>
            <FormControl>
              <Input {...field} placeholder="The guest's address" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

export default function BookingForm({
  roomType,
  bookings,
  rooms,
}: {
  roomType: { id: string; type_name: string; price_per_night: number };
  bookings: {
    check_in_at: Date;
    check_out_at: Date;
    roomId: string;
    room: { room_typeId: string };
    booking_status: BookingStatus;
  }[];
  rooms: roomsWithBookings[];
}) {
  const [loading, setLoading] = useState(false);
  const form = useZodForm({
    schema: createBookingSchema(),
  });
  const [availableRooms, setAvailableRooms] = useState<roomsWithBookings[]>();
  const [bookedDates] = useState<Date[]>(
    bookings.length !== 0
      ? getAllBookedDates(
          roomType.id,
          bookings,
          rooms.filter((room) => room.room_typeId === roomType.id).length,
        )
      : [],
  );
  const [step, setStep] = useState(0);
  const forms = [
    <EssentialsForm
      key={0}
      form={form}
      availableRooms={availableRooms}
      bookedDates={bookedDates}
      price_per_night={roomType.price_per_night}
    />,
    <GuestForm key={1} form={form} />,
  ];

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
        typeId: roomType.id,
      });
      setAvailableRooms(availableRooms);
    }
  }, [bookings, checkInDate, checkOutDate, rooms, roomType]);

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

    const createdInvoice = await payBookings(
      Number(values.room_count),
      roomType,
      getStayTimeInDays(values.check_in_at, values.check_out_at),
    );

    if (!createdInvoice.success) {
      setLoading(false);
      return toast.error(createdInvoice.message, { id: toastId });
    }

    const result = await bookRooms({
      ...values,
      roomIds: availableRooms!.map((room) => room.id),
    });

    if (!result.success) {
      setLoading(false);
      return toast.error(result.message, { id: toastId });
    }

    setLoading(false);
    toast.success(result.message, { id: toastId });

    window.location.href = createdInvoice.data as string;
  });

  return (
    <Card className="absolute left-1/2 top-10 w-full max-w-lg -translate-x-1/2 border-none">
      <CardHeader>
        <h1 className="mb-4">{toIDR(roomType.price_per_night)}/night</h1>
        <CardTitle className="mb-3">
          You&apos;re on your way to book the {roomType.type_name}
        </CardTitle>
        <CardDescription>
          Please pick a check in and check out date for us to check this
          type&apos;s rooms availability.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid w-full items-start gap-4">{forms[step]}</div>
            <div className="mt-4 flex w-full flex-col items-center gap-2">
              {step === 1 && (
                <Button
                  type={"button"}
                  variant={"outline"}
                  className="w-full"
                  disabled={loading}
                  onClick={() => {
                    setStep(0);
                  }}
                >
                  Back
                </Button>
              )}
              <Button
                type={"button"}
                variant={"default"}
                className="w-full"
                disabled={loading}
                onClick={
                  step === forms.length - 1
                    ? onSubmit
                    : async () => {
                        const isValid = await form.trigger([
                          "check_in_at",
                          "check_out_at",
                          "room_count",
                        ]);
                        if (isValid) {
                          setStep(1);
                        }
                      }
                }
              >
                {step === forms.length - 1 ? "Confirm" : "Next"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

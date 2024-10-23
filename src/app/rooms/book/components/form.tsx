"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useZodForm } from "@/hooks/useZodForm";
import {
  getAllBookedDates,
  getAvailableRooms,
  getStayTimeInDays,
  toIDR,
} from "@/lib/utils";
import { roomsWithBookings } from "@/types/relations";
import { BookingStatus } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import validator from "validator";
import { z } from "zod";
import { bookRooms, payBookings } from "../actions";
import { EssentialsForm } from "../forms/Essentials";
import { GuestForm } from "../forms/Guest";

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
      roomType.id,
      getStayTimeInDays(values.check_in_at, values.check_out_at),
    );

    if (!createdInvoice.success) {
      setLoading(false);
      return toast.error(createdInvoice.message, { id: toastId });
    }

    const result = await bookRooms({
      ...values,
      roomIds: availableRooms!.map((room) => room.id),
      room_typeId: roomType.id,
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

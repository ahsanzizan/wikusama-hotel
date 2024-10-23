"use client";
import { getStayTimeInDays, stringifyDate, toIDR } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface DownloadableReceiptProps {
  booking: Prisma.bookingGetPayload<{
    include: {
      room: { include: { room_type: true } };
      user: { select: { name: true; email: true } };
    };
  }>;
}

const DownloadableReceipt = React.forwardRef(
  (
    { booking }: DownloadableReceiptProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
  ) => {
    const { check_in_at, check_out_at, booked_at } = booking;

    return (
      <div
        ref={ref}
        className="mx-auto max-w-3xl rounded-lg border bg-[#fff] p-8 text-black shadow-lg"
      >
        <Image
          src={"/logo.png"}
          alt="Wikusama Hotel Logo"
          width={55}
          height={30}
          className="mx-auto mb-1 h-[60px] w-[110px]"
          unoptimized
        />
        <h1 className="mb-4 text-center text-3xl font-bold">Wikusama Hotel</h1>
        <p className="mb-4 text-center"># {booking.id}</p>
        <p className="mb-2 text-center text-sm text-gray-600">
          {stringifyDate(booked_at)}
        </p>
        <p className="mb-6 text-center text-sm text-gray-600">
          {booking.user.name} ({booking.user.email})
        </p>
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-semibold">Guest Details</h3>
          <p className="mb-1 text-gray-600">
            <span className="font-bold">Name:</span> {booking.guest_full_name}
          </p>
          <p className="mb-1 text-gray-600">
            <span className="font-bold">Email:</span> {booking.guest_email}
          </p>
          <p className="mb-1 text-gray-600">
            <span className="font-bold">Phone Number:</span>{" "}
            {booking.guest_phone}
          </p>
          <p className="mb-1 text-gray-600">
            <span className="font-bold">Address:</span> {booking.guest_address}
          </p>
        </div>
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-semibold">Booking Information</h3>
          <p className="mb-1 text-gray-600">
            <span className="font-bold">Check-in Date:</span>{" "}
            {stringifyDate(check_in_at)} at 12:00 PM
          </p>
          <p className="mb-1 text-gray-600">
            <span className="font-bold">Check-out Date:</span>{" "}
            {stringifyDate(check_out_at)} at 12:00 PM
          </p>
          <p className="mb-1 text-gray-600">
            <span className="font-bold">Number of Nights:</span>{" "}
            {getStayTimeInDays(check_in_at, check_out_at)} night(s)
          </p>
        </div>
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-semibold">Room Details</h3>
          <div>
            <p className="mb-1 font-semibold text-black">
              Room No. {booking.room.room_number} -{" "}
              {booking.room.room_type.type_name} (
              {toIDR(booking.room.room_type.price_per_night)} per night)
            </p>
            <p>{booking.room.room_type.description}</p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-semibold">Total Price</h3>
          <div className="flex w-full items-center justify-between border-b border-primary pb-2">
            <p>
              {booking.room.room_type.type_name}{" "}
              {toIDR(booking.room.room_type.price_per_night)}
            </p>
            <p>
              x{getStayTimeInDays(booking.check_in_at, booking.check_out_at)}{" "}
              day(s)
            </p>
          </div>
          <p className="text-lg font-bold text-gray-600">
            {toIDR(
              booking.room.room_type.price_per_night *
                getStayTimeInDays(booking.check_in_at, booking.check_out_at),
            )}
          </p>
        </div>

        {/* Thank you message */}
        <p className="mt-6 text-center text-gray-700">
          Thank you for choosing{" "}
          <span className="font-semibold">Wikusama Hotel</span>. We look forward
          to your next stay!
        </p>
      </div>
    );
  },
);
DownloadableReceipt.displayName = "DownloadableReceipt";

export default DownloadableReceipt;

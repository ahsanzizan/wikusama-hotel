"use client";
import { getStayTime, stringifyDate, toIDR } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface DownloadableReceiptProps {
  booking: Prisma.bookingGetPayload<{
    include: {
      room: { include: { room_type: true } };
      guest: { select: { name: true; email: true } };
    };
  }>;
}

const DownloadableReceipt = React.forwardRef(
  ({ booking }: DownloadableReceiptProps, ref: React.ForwardedRef<any>) => {
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
        <p className="mb-4 text-center">Booking ID {booking.id}</p>
        <p className="mb-6 text-center text-sm text-gray-600">
          Date of Booking: {stringifyDate(booked_at)}
        </p>
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-semibold">Guest Details</h3>
          <p className="mb-1 text-gray-600">
            <span className="font-bold">Name:</span> {booking.guest.name}
          </p>
          <p className="mb-1 text-gray-600">
            <span className="font-bold">Email:</span> {booking.guest.email}
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
            {getStayTime(check_in_at, check_out_at)} night(s)
          </p>
        </div>
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-semibold">Room Details</h3>
          <ul className="list-inside list-disc">
            <li className="mb-1">
              Room No. {booking.room.room_number} -{" "}
              {booking.room.room_type.type_name} (
              {toIDR(booking.room.room_type.price_per_night)} per night)
            </li>
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-semibold">Total Price</h3>
          <p className="text-lg font-bold text-gray-600">
            {toIDR(
              booking.room.room_type.price_per_night *
                getStayTime(booking.check_in_at, booking.check_out_at),
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

export default DownloadableReceipt;

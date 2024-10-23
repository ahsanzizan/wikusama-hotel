"use client";
import { cn, getStayTimeInDays, stringifyDate, toIDR } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import React, { useMemo } from "react";

interface DownloadableReceiptProps {
  bookingReceipt: Prisma.booking_receiptGetPayload<{
    include: {
      booking: { include: { room: { include: { room_type: true } } } };
      user: { select: { name: true; email: true } };
    };
  }>;
}

const DownloadableReceipt = React.forwardRef(
  (
    { bookingReceipt }: DownloadableReceiptProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
  ) => {
    const {
      booking: {
        check_in_at,
        check_out_at,
        booked_at,
        room: { room_type },
        guest_address,
        guest_email,
        guest_full_name,
        guest_phone,
      },
      id,
      discount,
      price,
      room_number,
      room_type_name,
      room_type_description,
      user,
    } = bookingReceipt;

    const discountedPrice = useMemo(
      () => price - price * (discount / 100),
      [discount, price],
    );
    const totalPrice = useMemo(
      () => discountedPrice * getStayTimeInDays(check_in_at, check_out_at),
      [check_in_at, check_out_at, discountedPrice],
    );

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
        <p className="mb-4 text-center"># {id}</p>
        <p className="mb-2 text-center text-sm text-gray-600">
          {stringifyDate(booked_at)}
        </p>
        <p className="mb-6 text-center text-sm text-gray-600">
          {user.name} ({user.email})
        </p>
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-semibold">Guest Details</h3>
          <p className="mb-1 text-gray-600">
            <span className="font-bold">Name:</span> {guest_full_name}
          </p>
          <p className="mb-1 text-gray-600">
            <span className="font-bold">Email:</span> {guest_email}
          </p>
          <p className="mb-1 text-gray-600">
            <span className="font-bold">Phone Number:</span> {guest_phone}
          </p>
          <p className="mb-1 text-gray-600">
            <span className="font-bold">Address:</span> {guest_address}
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
              Room No. {room_number} - {room_type_name} (
              {toIDR(room_type.price_per_night)} per night)
            </p>
            <p>{room_type_description}</p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-semibold">Total Price</h3>
          <div className="flex w-full items-center justify-between border-b border-primary pb-2">
            <p className={cn(discount > 0 && "line-through")}>
              {toIDR(room_type.price_per_night)}
            </p>
            <p>x{getStayTimeInDays(check_in_at, check_out_at)} day(s)</p>
          </div>
          <p className="text-lg font-bold text-gray-600">{toIDR(totalPrice)}</p>
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

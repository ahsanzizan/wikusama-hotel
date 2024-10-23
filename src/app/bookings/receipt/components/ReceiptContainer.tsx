"use client";
import { Prisma } from "@prisma/client";
import html2pdf from "html2pdf.js";
import { useCallback, useEffect, useRef } from "react";
import DownloadableReceipt from "./DownloadableReceipt";

interface ReceiptContainerProps {
  bookingReceipt: Prisma.booking_receiptGetPayload<{
    include: {
      booking: { include: { room: { include: { room_type: true } } } };
      user: { select: { name: true; email: true } };
    };
  }>;
}

export default function ReceiptContainer({
  bookingReceipt,
}: ReceiptContainerProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const downloadPdf = useCallback(() => {
    const options = {
      margin: 0,
      filename: `Receipt_${bookingReceipt.user.name}_Room${bookingReceipt.booking.room.room_number}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    const element = receiptRef.current;

    if (element) {
      html2pdf()
        .from(element)
        .set(options)
        .save(
          `Receipt_${bookingReceipt.user.name}_Room${bookingReceipt.booking.room.room_number}.pdf`,
        )
        .catch((err: string) => console.error(err))
        .then(() => {
          window.location.href = "/bookings";
        });
    }
  }, [bookingReceipt]);

  useEffect(() => {
    downloadPdf();
  }, [downloadPdf]);

  return (
    <DownloadableReceipt bookingReceipt={bookingReceipt} ref={receiptRef} />
  );
}

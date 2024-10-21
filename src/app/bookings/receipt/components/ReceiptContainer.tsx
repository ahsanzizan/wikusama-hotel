"use client";
import DownloadableReceipt from "@/components/utils/DownloadableReceipt";
import { Prisma } from "@prisma/client";
import html2pdf from "html2pdf.js";
import { useCallback, useEffect, useRef } from "react";

interface ReceiptContainerProps {
  booking: Prisma.bookingGetPayload<{
    include: {
      room: { include: { room_type: true } };
      guest: { select: { name: true; email: true } };
    };
  }>;
}

export default function ReceiptContainer({ booking }: ReceiptContainerProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const downloadPdf = useCallback(() => {
    const options = {
      margin: 0,
      filename: `Receipt_${booking.guest.name}_Room${booking.room.room_number}.pdf`,
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
          `Receipt_${booking.guest.name}_Room${booking.room.room_number}.pdf`,
        )
        .catch((err: string) => console.error(err))
        .then(() => {
          window.location.href = "/bookings";
        });
    }
  }, [booking]);

  useEffect(() => {
    downloadPdf();
  }, [downloadPdf]);

  return <DownloadableReceipt booking={booking} ref={receiptRef} />;
}

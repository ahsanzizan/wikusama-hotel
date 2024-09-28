"use client";
import DownloadableReceipt from "@/components/utils/DownloadableReceipt";
import { Prisma } from "@prisma/client";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import DisableContextAndDevTools from "@/components/layout/DisableContextAndDevTools";

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

  const downloadPdf = () => {
    const options = {
      margin: 0,
      filename: "my-component.pdf",
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
        .catch((err: string) => console.error(err));
    }
  };

  return (
    <DisableContextAndDevTools>
      <div className="block">
        <Button
          onClick={() => {
            downloadPdf();
          }}
          className="mb-8 w-full"
          variant={"secondary"}
        >
          Download
        </Button>
        <DownloadableReceipt ref={receiptRef} booking={booking} />
      </div>
    </DisableContextAndDevTools>
  );
}

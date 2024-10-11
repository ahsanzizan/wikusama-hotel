"use client";
import { stringifyDate } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { Copy, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { toast } from "sonner";
import { deleteReview } from "../actions";

type reviewWithBooking = Prisma.reviewGetPayload<{
  include: {
    booking: {
      select: {
        check_in_at: true;
        check_out_at: true;
        guest: { select: { name: true } };
      };
    };
  };
}>;

export default function ReviewsTable({
  reviews,
}: {
  reviews: reviewWithBooking[];
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  async function deleteAction(id: string) {
    if (!confirm("Are you sure to delete this review?")) return;

    const toastId = toast.loading("Loading...");
    const deleteResponse = await deleteReview(id);

    if (deleteResponse.success) {
      toast.success(deleteResponse.message, { id: toastId });
      router.refresh();
    } else toast.error(deleteResponse.message, { id: toastId });
  }

  const columns: TableColumn<reviewWithBooking>[] = [
    {
      name: "#",
      selector: (_, i) => i! + 1,
      sortable: true,
    },
    {
      name: "Guest",
      selector: (row) => row.guest_name,
      sortable: true,
    },
    {
      name: "Account",
      selector: (row) => row.booking.guest.name,
      sortable: false,
    },
    {
      name: "Rating",
      selector: (row) => row.rate,
      sortable: false,
    },
    {
      name: "Testimony",
      selector: (row) =>
        row.testimony.length > 20
          ? row.testimony.slice(0, 20) + "..."
          : row.testimony,
      sortable: false,
    },
    {
      name: "Submitted at",
      selector: (row) => stringifyDate(row.submitted_at),
      sortable: false,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard
                .writeText(row.testimony)
                .then(() => {
                  alert("Text copied to clipboard!");
                })
                .catch((err) => {
                  console.error("Failed to copy text: ", err);
                });
            }}
            title="Copy Testimony"
            className="me-2 rounded bg-blue-200 p-2.5 text-xs font-medium text-white transition-all hover:bg-blue-500 hover:text-white"
          >
            <Copy />
          </button>
          <button
            onClick={() => deleteAction(row.id)}
            title="Delete Competition"
            className="me-2 rounded bg-red-100 p-2.5 text-xs font-medium text-red-800 transition-all hover:bg-red-700 hover:text-white"
          >
            <Trash />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="block">
      <DataTable columns={columns} data={reviews} pagination highlightOnHover />
    </div>
  );
}

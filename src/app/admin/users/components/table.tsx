"use client";
import { stringifyDate } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { differenceInYears } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "sonner";
import { deleteUser } from "../actions";

type userWithBookings = Prisma.userGetPayload<{ include: { bookings: true } }>;

export default function GuestsTable({
  guests,
}: {
  guests: userWithBookings[];
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  async function deleteAction(id: string) {
    if (!confirm("Are you sure to delete this receptionist account?")) return;

    const toastId = toast.loading("Loading...");
    const deleteResponse = await deleteUser(id);

    if (deleteResponse.success) {
      toast.success(deleteResponse.message, { id: toastId });
      router.refresh();
    } else toast.error(deleteResponse.message, { id: toastId });
  }

  const columns: TableColumn<userWithBookings>[] = [
    {
      name: "#",
      selector: (_, i) => i! + 1,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: false,
    },
    {
      name: "Residence",
      selector: (row) => row.city_of_residence || "None",
      sortable: false,
    },
    {
      name: "Birthday",
      selector: (row) =>
        row.birth_date ? stringifyDate(row.birth_date) : "None",
      sortable: false,
    },
    {
      name: "Age",
      selector: (row) =>
        row.birth_date ? differenceInYears(new Date(), row.birth_date) : "None",
      sortable: false,
    },
    {
      name: "Bookings",
      selector: (row) => row.bookings.length,
      sortable: false,
    },
    {
      name: "Created at",
      selector: (row) => stringifyDate(row.created_at),
      sortable: false,
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => deleteAction(row.id)}
          title="Delete Competition"
          className="me-2 rounded bg-red-100 p-2.5 text-xs font-medium text-red-800 transition-all hover:bg-red-700 hover:text-white"
        >
          <FaRegTrashAlt />
        </button>
      ),
    },
  ];

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="block">
      <DataTable columns={columns} data={guests} pagination highlightOnHover />
    </div>
  );
}

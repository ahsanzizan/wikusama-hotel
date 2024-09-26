"use client";
import { Button } from "@/components/ui/button";
import { stringifyDate } from "@/lib/utils";
import { user } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { toast } from "sonner";
import { deleteReceptionist } from "../actions";
import ReceptionistModal from "./modal";

export default function ReceptionistsTable({
  receptionists,
}: {
  receptionists: user[];
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalData, setEditModalData] = useState<user | null>(null);
  const router = useRouter();

  function edit(data: user) {
    setEditModalData(data);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(true);
  }

  function create() {
    setEditModalData(null);
    setIsEditModalOpen(false);
    setIsCreateModalOpen(true);
  }

  async function deleteAction(id: string) {
    if (!confirm("Are you sure to delete this receptionist account?")) return;

    const toastId = toast.loading("Loading...");
    const deleteResponse = await deleteReceptionist(id);

    if (deleteResponse.success) {
      toast.success(deleteResponse.message, { id: toastId });
      router.refresh();
    } else toast.error(deleteResponse.message, { id: toastId });
  }

  const columns: TableColumn<user>[] = [
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
      name: "Created at",
      selector: (row) => stringifyDate(row.created_at),
      sortable: false,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => edit(row)}
            title="Edit Competition"
            className="me-2 rounded bg-blue-100 p-2.5 text-xs font-medium text-blue-800 transition-all hover:bg-blue-700 hover:text-white"
          >
            <FaPencilAlt />
          </button>
          <button
            onClick={() => deleteAction(row.id)}
            title="Delete Competition"
            className="me-2 rounded bg-red-100 p-2.5 text-xs font-medium text-red-800 transition-all hover:bg-red-700 hover:text-white"
          >
            <FaRegTrashAlt />
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
      <Button
        variant={"secondary"}
        className="mb-5"
        onClick={() => {
          create();
        }}
      >
        Create
      </Button>
      {isEditModalOpen && (
        <ReceptionistModal
          setIsOpenModal={setIsEditModalOpen}
          data={editModalData}
        />
      )}
      {isCreateModalOpen && (
        <ReceptionistModal setIsOpenModal={setIsCreateModalOpen} data={null} />
      )}

      <DataTable
        columns={columns}
        data={receptionists}
        pagination
        highlightOnHover
      />
    </div>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { roomWithBookingsAndType } from "@/types/relations";
import { room_type } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { toast } from "sonner";
import { deleteRoom } from "../actions";
import RoomModal from "./modal";

export default function RoomsTable({
  rooms,
  roomTypes,
}: {
  rooms: roomWithBookingsAndType[];
  roomTypes: room_type[];
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalData, setEditModalData] =
    useState<roomWithBookingsAndType | null>(null);
  const router = useRouter();

  function edit(data: roomWithBookingsAndType) {
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
    if (!confirm("Are you sure to delete this room?")) return;

    const toastId = toast.loading("Loading...");
    const deleteResponse = await deleteRoom(id);

    if (deleteResponse.success) {
      toast.success(deleteResponse.message, { id: toastId });
      router.refresh();
    } else toast.error(deleteResponse.message, { id: toastId });
  }

  const columns: TableColumn<roomWithBookingsAndType>[] = [
    {
      name: "#",
      selector: (_, i) => i! + 1,
      sortable: true,
    },
    {
      name: "Room Number",
      selector: (row) => row.room_number,
      sortable: true,
    },

    {
      name: "Type",
      selector: (row) => row.room_type.type_name,
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
        <RoomModal
          roomTypes={roomTypes}
          setIsOpenModal={setIsEditModalOpen}
          data={editModalData}
        />
      )}
      {isCreateModalOpen && (
        <RoomModal
          roomTypes={roomTypes}
          setIsOpenModal={setIsCreateModalOpen}
          data={null}
        />
      )}

      <DataTable columns={columns} data={rooms} pagination highlightOnHover />
    </div>
  );
}

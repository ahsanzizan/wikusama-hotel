"use client";
import { Button } from "@/components/ui/button";
import { RoomTypesWithRoomsCount } from "@/types/relations";
import { room_type } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteRoomType } from "../actions";
import RoomTypeModal from "./modal";
import { FaPencil, FaTrash } from "react-icons/fa6";

export default function RoomTypesDataManager({
  roomTypes,
}: {
  roomTypes: RoomTypesWithRoomsCount[];
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState<room_type | null>(null);
  const router = useRouter();

  function edit(data: room_type) {
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
    if (!confirm("Are you sure to delete this room type?")) return;

    const toastId = toast.loading("Loading...");
    const deleteResponse = await deleteRoomType(id);

    if (deleteResponse.success) {
      toast.success(deleteResponse.message, { id: toastId });
      router.refresh();
    } else toast.error(deleteResponse.message, { id: toastId });
  }

  function RoomCard({ roomType }: { roomType: RoomTypesWithRoomsCount }) {
    return (
      <div className="rounded-md border border-neutral-800">
        <div className="relative mb-4">
          <Image
            src={roomType.photo}
            alt={roomType.type_name}
            width={330}
            height={285}
            className="h-[285px] w-full"
            unoptimized
          />
          <div className="absolute right-3 top-3 flex items-center gap-2 rounded-md bg-white">
            <Button
              onClick={() => {
                deleteAction(roomType.id);
              }}
              variant={"link"}
            >
              <FaTrash />
            </Button>
            <Button
              onClick={() => {
                edit(roomType);
              }}
              variant={"link"}
            >
              <FaPencil />
            </Button>
          </div>
        </div>
        <div className="p-5 text-center">
          <h3 className="mb-3">{roomType.type_name}</h3>
          <p>{roomType.description}</p>
        </div>
      </div>
    );
  }

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
        <RoomTypeModal
          setIsOpenModal={setIsEditModalOpen}
          data={editModalData}
        />
      )}
      {isCreateModalOpen && (
        <RoomTypeModal setIsOpenModal={setIsCreateModalOpen} data={null} />
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {roomTypes.map((roomType) => (
          <RoomCard key={roomType.id} roomType={roomType} />
        ))}
      </div>
    </div>
  );
}

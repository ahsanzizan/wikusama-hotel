import prisma from "@/lib/prisma";
import RoomTypesDataManager from "./components/room-types-data-manager";

export default async function RoomTypes() {
  const [roomTypes] = await prisma.$transaction([
    prisma.room_type.findMany({
      include: { rooms: { include: { bookings: true } } },
    }),
  ]);

  return (
    <>
      <div className="mb-10">
        <h1 className="mb-3">Manage Room Types</h1>
        <p>
          In this section, you can: Create, Update, and Delete room types. Keep
          in mind that rooms with that type will also be deleted if a room type
          is deleted.
        </p>
      </div>
      <RoomTypesDataManager roomTypes={roomTypes} />
    </>
  );
}

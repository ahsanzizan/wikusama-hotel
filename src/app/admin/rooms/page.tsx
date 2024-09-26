import prisma from "@/lib/prisma";
import RoomsTable from "./components/table";

export default async function Rooms() {
  const [rooms, roomTypes] = await prisma.$transaction([
    prisma.room.findMany({
      include: { bookings: true, room_type: { select: { type_name: true } } },
    }),
    prisma.room_type.findMany(),
  ]);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2>Rooms List</h2>
          <p>Create and edit rooms</p>
        </div>
      </div>
      <RoomsTable rooms={rooms} roomTypes={roomTypes} />
    </div>
  );
}

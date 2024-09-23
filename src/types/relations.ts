import { Prisma } from "@prisma/client";

export type RoomTypesWithRoomsCount = Prisma.room_typeGetPayload<{
  include: { rooms: { select: { id: true; bookings: true } } };
}>;

import { Prisma } from "@prisma/client";

export type RoomTypesWithRoomsCount = Prisma.room_typeGetPayload<{
  include: { rooms: { select: { id: true; bookings: true } } };
}>;

export type roomWithBookingsAndType = Prisma.roomGetPayload<{
  include: { bookings: true; room_type: { select: { type_name: true } } };
}>;

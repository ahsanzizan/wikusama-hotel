import { Prisma } from "@prisma/client";

export type roomTypesWithRoomsCount = Prisma.room_typeGetPayload<{
  include: { rooms: { include: { id: true; bookings: true } } };
}>;

export type roomWithBookingsAndType = Prisma.roomGetPayload<{
  include: { bookings: true; room_type: { select: { type_name: true } } };
}>;

export type roomsWithBookings = Prisma.roomGetPayload<{
  include: { bookings: true };
}>;

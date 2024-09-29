"use server";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { ServerActionResponse } from "@/types/server-action";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function bookRooms(data: {
  check_in_at: Date;
  check_out_at: Date;
  availableRoomIds: string[];
}): Promise<ServerActionResponse> {
  const {
    check_in_at: preset_checkInDate,
    check_out_at: preset_checkOutDate,
    availableRoomIds,
  } = data;

  preset_checkInDate.setHours(12, 0, 0);
  preset_checkOutDate.setHours(12, 0, 0);

  try {
    const session = await getServerSession();
    const currentUserId = session?.user?.id;

    const payload = availableRoomIds.map((roomId) => ({
      check_in_at: preset_checkInDate,
      check_out_at: preset_checkOutDate,
      guestId: currentUserId,
      roomId,
    })) as unknown as Prisma.bookingCreateManyInput;

    // Uses $transaction to resolve race condition
    await prisma.$transaction(async (prisma) => {
      const conflictingBookings = await prisma.booking.findMany({
        where: {
          roomId: { in: availableRoomIds },
          OR: [
            {
              check_in_at: { lte: preset_checkOutDate },
              check_out_at: { gte: preset_checkInDate },
            },
          ],
        },
        include: { room: { select: { room_number: true } } },
      });

      if (conflictingBookings.length > 0)
        throw new Error(
          `${conflictingBookings.length} room(s) are already booked during the selected dates.`,
        );

      await prisma.booking.createMany({
        data: payload,
      });
    });

    revalidatePath("/", "layout");
    return {
      success: true,
      message: `Successfully booked ${availableRoomIds.length} rooms`,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: (error.message as string).includes("already booked")
        ? error.message
        : "Something went wrong!",
    };
  }
}

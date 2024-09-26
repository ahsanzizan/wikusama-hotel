"use server";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { ServerActionResponse } from "@/types/server-action";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function upsertRoom(
  data: { room_number?: number; is_available?: boolean; room_typeId?: string },
  id?: string,
): Promise<ServerActionResponse> {
  try {
    const session = await getServerSession();
    const currentUserRole = session?.user?.role;
    const currentUserId = session?.user?.id;

    if (currentUserRole !== "ADMIN")
      return { success: false, message: "Forbidden" };

    const { room_number, is_available, room_typeId } = data;

    const payload: Prisma.roomUpdateInput = {
      room_number,
      is_available,
      room_type: { connect: { id: room_typeId } },
      created_by: !id ? { connect: { id: currentUserId } } : undefined,
    };

    if (!id) {
      const { room_number, is_available } = payload;
      if (!room_number || !is_available) {
        return { success: false, message: "Bad request" };
      }

      const roomAlreadyExist = await prisma.room.findUnique({
        where: { room_number: room_number as number },
      });
      if (roomAlreadyExist)
        return { success: false, message: "Room number is in use!" };

      await prisma.room.create({
        data: payload as Prisma.roomCreateInput,
      });

      revalidatePath("/", "layout");
      return { success: true, message: "Successfully created room!" };
    }

    const roomToUpdate = await prisma.room.findUnique({
      where: { id },
    });
    if (!roomToUpdate) return { success: false, message: "Room is not found!" };

    await prisma.room.update({ where: { id }, data: payload });

    revalidatePath("/", "layout");
    return { success: true, message: "Successfully updated a room!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function deleteRoom(id: string): Promise<ServerActionResponse> {
  try {
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) return { success: false, message: "Room type does not exist" };

    await prisma.room.delete({ where: { id } });

    revalidatePath("/", "layout");
    return { success: false, message: "Deleted successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}

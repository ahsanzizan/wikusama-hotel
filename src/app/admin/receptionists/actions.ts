"use server";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { ServerActionResponse } from "@/types/server-action";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function upsertReciptionist(
  data: Prisma.userUpdateInput,
  id?: string,
): Promise<ServerActionResponse> {
  try {
    const session = await getServerSession();
    const currentUserRole = session?.user?.role;

    if (currentUserRole !== "ADMIN")
      return { success: false, message: "Forbidden" };

    const payload: Prisma.userUpdateInput = {
      ...data,
      role: "RECEPTIONIST",
      verified: true,
    };

    if (!id) {
      const { name, email, password } = payload;
      if (!name || !email || !password) {
        return { success: false, message: "Bad request" };
      }

      await prisma.user.create({
        data: payload as Prisma.userCreateInput,
      });

      revalidatePath("/", "layout");
      return { success: true, message: "Successfully created reciptionist!" };
    }

    const userToUpdate = await prisma.user.findUnique({
      where: { id },
    });
    if (!userToUpdate)
      return { success: false, message: "reciptionist is not found!" };

    await prisma.user.update({ where: { id }, data: payload });

    revalidatePath("/", "layout");
    return { success: true, message: "Successfully updated a reciptionist!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function deleteReceptionist(
  id: string,
): Promise<ServerActionResponse> {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return { success: false, message: "User does not exist" };

    await prisma.user.delete({ where: { id } });

    revalidatePath("/", "layout");
    return { success: false, message: "Deleted successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}

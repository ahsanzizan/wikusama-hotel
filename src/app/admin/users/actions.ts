"use server";
import prisma from "@/lib/prisma";
import { ServerActionResponse } from "@/types/server-action";
import { revalidatePath } from "next/cache";

export async function deleteUser(id: string): Promise<ServerActionResponse> {
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

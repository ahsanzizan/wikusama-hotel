"use server";
import prisma from "@/lib/prisma";
import { ServerActionResponse } from "@/types/server-action";
import { revalidatePath } from "next/cache";

export async function deleteReview(id: string): Promise<ServerActionResponse> {
  try {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return { success: false, message: "User does not exist" };

    await prisma.review.delete({ where: { id } });

    revalidatePath("/", "layout");
    return { success: false, message: "Deleted successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
}

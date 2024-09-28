"use server";
import prisma from "@/lib/prisma";
import { ServerActionResponse } from "@/types/server-action";
import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(
  id: string,
  desiredBookingStatus: BookingStatus,
): Promise<ServerActionResponse> {
  try {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return { success: false, message: "Booking is not found!" };

    await prisma.booking.update({
      where: { id },
      data: { booking_status: desiredBookingStatus },
    });

    revalidatePath("/", "layout");
    return { success: true, message: "Successfully updated booking status!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something is wrong!" };
  }
}

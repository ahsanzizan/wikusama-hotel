"use server";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { ServerActionResponse } from "@/types/server-action";
import { Prisma } from "@prisma/client";

export async function submitReview(data: {
  bookingId: string;
  name: string;
  rate: number;
  testimony: string;
}): Promise<ServerActionResponse<undefined>> {
  const { bookingId, name, rate, testimony } = data;

  if (rate > 5 || rate < 1)
    return { success: false, message: "Rate must be between 1 and 5!" };

  try {
    const session = await getServerSession();
    if (session?.user?.role !== "GUEST")
      return { success: false, message: "Forbidden" };

    const payload: Prisma.reviewCreateInput = {
      guest_name: name,
      rate,
      testimony,
      booking: { connect: { id: bookingId } },
    };

    await prisma.review.create({ data: payload });

    return { success: true, message: "Successfully submitted your review!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
}

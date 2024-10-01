"use server";

import { getServerSession } from "@/lib/next-auth";
import { Gender, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ServerActionResponse } from "@/types/server-action";

export async function updateProfile(data: {
  name?: string;
  gender?: Gender;
  birth_date?: Date;
  city_of_residence?: string;
  mobile_number?: string;
}): Promise<ServerActionResponse> {
  try {
    const session = await getServerSession();

    const payload: Prisma.userUpdateInput = {
      ...data,
    };

    await prisma.user.update({
      where: { id: session?.user?.id },
      data: payload,
    });

    return { success: true, message: "Successfully updated profile!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
}

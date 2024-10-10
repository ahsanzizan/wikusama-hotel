"use server";

import { getServerSession } from "@/lib/next-auth";
import { Gender, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ServerActionResponse } from "@/types/server-action";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  name?: string;
  gender?: Gender;
  birth_date?: Date;
  city_of_residence?: string;
  mobile_number?: string;
}): Promise<ServerActionResponse<undefined>> {
  try {
    const session = await getServerSession();

    const payload: Prisma.userUpdateInput = {
      ...data,
    };

    await prisma.user.update({
      where: { id: session?.user?.id },
      data: payload,
    });

    revalidatePath("/", "layout");
    return { success: true, message: "Successfully updated profile!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
}

export async function deleteAccount(): Promise<
  ServerActionResponse<undefined>
> {
  try {
    const session = await getServerSession();
    const deletedAccount = await prisma.user.delete({
      where: { id: session?.user?.id },
    });

    revalidatePath("/", "layout");
    return {
      success: true,
      message: `Your account (${deletedAccount.email}) has been deleted. You've been logged out.`,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong!",
    };
  }
}

"use server";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { fileToBuffer } from "@/lib/utils";
import { uploadImage } from "@/lib/utils-actions";
import { ServerActionResponse } from "@/types/server-action";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function upsertRoomType(
  formData: FormData,
  id?: string,
): Promise<ServerActionResponse<undefined>> {
  const data = {
    type_name: formData.get("type_name") as string,
    description: formData.get("description") as string,
    photo: formData.get("photo") as FileList[0],
    price_per_night: Number(formData.get("price_per_night") as string),
  };

  try {
    const session = await getServerSession();
    const currentUserRole = session?.user?.role;
    const currentUserId = session?.user?.id;

    if (currentUserRole !== "ADMIN")
      return { success: false, message: "Forbidden" };

    const payload: Prisma.room_typeUpdateInput = {
      type_name: data.type_name,
      description: data.description,
      price_per_night: data.price_per_night,
      photo: undefined,
      created_by: !id
        ? {
            connect: { id: currentUserId },
          }
        : undefined,
    };

    if (data.photo instanceof File) {
      const photoBuffer = await fileToBuffer(data.photo);
      const uploadedPhoto = await uploadImage(photoBuffer);

      payload.photo = uploadedPhoto.data?.url;
    }

    if (!id) {
      const { type_name, description, photo, price_per_night } = payload;
      if (!type_name || !description || !photo || !price_per_night) {
        return { success: false, message: "Bad request" };
      }

      await prisma.room_type.create({
        data: payload as Prisma.room_typeCreateInput,
      });

      revalidatePath("/", "layout");
      return { success: true, message: "Successfully created room type!" };
    }

    const roomTypeToUpdate = await prisma.room_type.findUnique({
      where: { id },
    });
    if (!roomTypeToUpdate)
      return { success: false, message: "Room type is not found!" };

    await prisma.room_type.update({ where: { id }, data: payload });

    revalidatePath("/", "layout");
    return { success: true, message: "Successfully updated room type!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function deleteRoomType(
  id: string,
): Promise<ServerActionResponse<undefined>> {
  try {
    const roomType = await prisma.room_type.findUnique({ where: { id } });
    if (!roomType)
      return { success: false, message: "Room type does not exist" };

    await prisma.room_type.delete({ where: { id } });

    revalidatePath("/", "layout");
    return { success: false, message: "Deleted successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}

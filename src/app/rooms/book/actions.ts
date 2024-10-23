"use server";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { ServerActionResponse } from "@/types/server-action";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import Xendit from "xendit-node";

export async function bookRooms(data: {
  check_in_at: Date;
  check_out_at: Date;
  roomIds: string[];
  guest_full_name: string;
  guest_email: string;
  guest_phone_number: string;
  guest_address: string;
  room_typeId: string;
}): Promise<ServerActionResponse<undefined>> {
  const {
    check_in_at: preset_checkInDate,
    check_out_at: preset_checkOutDate,
    roomIds: availableRoomIds,
    guest_address,
    guest_email,
    guest_full_name,
    guest_phone_number,
    room_typeId,
  } = data;

  preset_checkInDate.setHours(12, 0, 0);
  preset_checkOutDate.setHours(12, 0, 0);

  try {
    const session = await getServerSession();
    const currentUserId = session?.user?.id;

    const payload = availableRoomIds.map((roomId) => ({
      check_in_at: preset_checkInDate,
      check_out_at: preset_checkOutDate,
      guest_address,
      guest_email,
      guest_full_name,
      guest_phone: guest_phone_number,
      roomId,
      userId: currentUserId,
    })) as unknown as Prisma.bookingCreateManyInput[];

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

      const newlyCreatedBookings = await prisma.booking.findMany({
        where: {
          room: { room_typeId },
          check_in_at: preset_checkInDate,
          check_out_at: preset_checkOutDate,
        },
        include: { room: { include: { room_type: true } } },
      });

      await prisma.booking_receipt.createMany({
        data: newlyCreatedBookings.map((booking) => ({
          bookingId: booking.id,
          discount: booking.room.room_type.discount_percent,
          price: booking.room.room_type.price_per_night,
          room_number: booking.room.room_number,
          room_type_name: booking.room.room_type.type_name,
          room_type_description: booking.room.room_type.description,
          userId: currentUserId,
        })) as Prisma.booking_receiptCreateManyInput[],
      });
    });

    revalidatePath("/", "layout");
    return {
      success: true,
      message: `Successfully booked ${availableRoomIds.length} rooms`,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message = error.message as string;

    console.log(error);
    return {
      success: false,
      message: message.includes("already booked")
        ? error.message
        : "Something went wrong!",
    };
  }
}

const xenditClient = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY });
const { Invoice } = xenditClient;

export async function payBookings(
  roomCount: number,
  roomTypeId: string,
  stayTime: number,
): Promise<ServerActionResponse<string>> {
  try {
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    });
    if (!user) return { success: false, message: "User not authorized" };

    const roomType = await prisma.room_type.findUnique({
      where: { id: roomTypeId },
    });
    if (!roomType) return { success: false, message: "Room type not found" };

    const discountedPrice =
      roomType.price_per_night -
      roomType.price_per_night * (roomType.discount_percent / 100);
    const totalPrice = roomCount * (discountedPrice * stayTime);
    const createdInvoice = await Invoice.createInvoice({
      data: {
        externalId: uuidv4(),
        amount: totalPrice,
        payerEmail: session?.user?.email,
        description: `Payment for bookings in Wikusama Hotel. ${roomType.type_name} (${roomCount} rooms, ${stayTime} nights).`,
        successRedirectUrl: `${process.env.APP_URL}/bookings`,
        failureRedirectUrl: `${process.env.APP_URL}/`,
      },
    });

    return {
      success: true,
      message: "Successfully created an invoice.",
      data: createdInvoice.invoiceUrl,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong!",
    };
  }
}

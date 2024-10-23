/*
  Warnings:

  - You are about to drop the `BookingReceipt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookingReceipt" DROP CONSTRAINT "BookingReceipt_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "BookingReceipt" DROP CONSTRAINT "BookingReceipt_userId_fkey";

-- DropTable
DROP TABLE "BookingReceipt";

-- CreateTable
CREATE TABLE "booking_receipt" (
    "id" TEXT NOT NULL,
    "room_type_name" TEXT NOT NULL,
    "room_number" INTEGER NOT NULL,
    "room_type_description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,

    CONSTRAINT "booking_receipt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "booking_receipt" ADD CONSTRAINT "booking_receipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_receipt" ADD CONSTRAINT "booking_receipt_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `booking_receipt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `review` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "booking_receipt" DROP CONSTRAINT "booking_receipt_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "booking_receipt" DROP CONSTRAINT "booking_receipt_userId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_bookingId_fkey";

-- DropTable
DROP TABLE "booking_receipt";

-- DropTable
DROP TABLE "review";

-- CreateTable
CREATE TABLE "booking_receipts" (
    "id" TEXT NOT NULL,
    "room_type_name" TEXT NOT NULL,
    "room_number" INTEGER NOT NULL,
    "room_type_description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,

    CONSTRAINT "booking_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "guest_name" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "testimony" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookingId" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "booking_receipts_bookingId_key" ON "booking_receipts"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_bookingId_key" ON "reviews"("bookingId");

-- AddForeignKey
ALTER TABLE "booking_receipts" ADD CONSTRAINT "booking_receipts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_receipts" ADD CONSTRAINT "booking_receipts_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

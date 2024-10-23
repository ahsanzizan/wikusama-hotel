/*
  Warnings:

  - A unique constraint covering the columns `[bookingId]` on the table `booking_receipt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "booking_receipt_bookingId_key" ON "booking_receipt"("bookingId");

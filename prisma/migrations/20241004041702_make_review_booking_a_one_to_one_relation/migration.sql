/*
  Warnings:

  - A unique constraint covering the columns `[bookingId]` on the table `review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "review_bookingId_key" ON "review"("bookingId");

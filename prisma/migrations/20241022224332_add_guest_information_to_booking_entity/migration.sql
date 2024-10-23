/*
  Warnings:

  - You are about to drop the column `guestId` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `guest_address` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guest_email` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guest_full_name` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guest_phone` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_guestId_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "guestId",
ADD COLUMN     "guest_address" TEXT NOT NULL,
ADD COLUMN     "guest_email" TEXT NOT NULL,
ADD COLUMN     "guest_full_name" TEXT NOT NULL,
ADD COLUMN     "guest_phone" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

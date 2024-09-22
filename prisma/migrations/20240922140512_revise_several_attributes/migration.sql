/*
  Warnings:

  - You are about to drop the column `pricePerNight` on the `room_types` table. All the data in the column will be lost.
  - You are about to drop the column `verificationToken` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[verification_token]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price_per_night` to the `room_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "room_types" DROP COLUMN "pricePerNight",
ADD COLUMN     "price_per_night" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "verificationToken",
ADD COLUMN     "verification_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_verification_token_key" ON "users"("verification_token");

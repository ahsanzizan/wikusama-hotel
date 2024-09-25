/*
  Warnings:

  - Added the required column `userId` to the `room_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "room_types" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "room_types" ADD CONSTRAINT "room_types_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

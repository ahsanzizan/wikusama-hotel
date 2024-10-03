/*
  Warnings:

  - You are about to drop the column `guest_nae` on the `review` table. All the data in the column will be lost.
  - Added the required column `guest_name` to the `review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "review" DROP COLUMN "guest_nae",
ADD COLUMN     "guest_name" TEXT NOT NULL;

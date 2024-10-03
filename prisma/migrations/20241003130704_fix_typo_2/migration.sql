/*
  Warnings:

  - You are about to drop the column `testiomony` on the `review` table. All the data in the column will be lost.
  - Added the required column `testiomny` to the `review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "review" DROP COLUMN "testiomony",
ADD COLUMN     "testiomny" TEXT NOT NULL;

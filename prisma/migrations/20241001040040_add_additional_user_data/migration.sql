-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "city_of_residence" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "mobile_number" TEXT;

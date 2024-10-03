-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "guest_nae" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "testiomony" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "review_bookingId_key" ON "review"("bookingId");

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

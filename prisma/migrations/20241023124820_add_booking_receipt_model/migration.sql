-- CreateTable
CREATE TABLE "BookingReceipt" (
    "id" TEXT NOT NULL,
    "room_type_name" TEXT NOT NULL,
    "room_number" INTEGER NOT NULL,
    "room_type_description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,

    CONSTRAINT "BookingReceipt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookingReceipt" ADD CONSTRAINT "BookingReceipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingReceipt" ADD CONSTRAINT "BookingReceipt_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

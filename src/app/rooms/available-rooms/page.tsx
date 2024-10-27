import PageContainer from "@/components/layout/PageContainer";
import PageHeading from "@/components/layout/PageHeading";
import prisma from "@/lib/prisma";
import { isISODateString } from "@/lib/utils";
import { notFound } from "next/navigation";
import Filter from "./components/Filter";

export default async function AvailableRooms({
  searchParams,
}: {
  searchParams: { check_in: string; check_out: string };
}) {
  const { check_in, check_out } = searchParams;
  if (
    !check_in ||
    !check_out ||
    !isISODateString(check_in) ||
    !isISODateString(check_out)
  )
    return notFound();

  const checkInDate = new Date(check_in);
  const checkOutDate = new Date(check_out);

  const roomTypes = await prisma.room_type.findMany({
    include: {
      rooms: { include: { bookings: true } },
    },
  });

  return (
    <PageContainer>
      <PageHeading
        backHref="/"
        title="Check Availability"
        description="Check our rooms' availability in between your desired check-in and check-out date."
      />
      <Filter
        checkIn={checkInDate}
        checkOut={checkOutDate}
        roomTypes={roomTypes}
      />
    </PageContainer>
  );
}

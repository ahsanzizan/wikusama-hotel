import PageContainer from "@/components/layout/PageContainer";
import PageHeading from "@/components/layout/PageHeading";
import prisma from "@/lib/prisma";
import { isISODateString } from "@/lib/utils";
import { notFound } from "next/navigation";
import Filter from "./components/Filter";

async function getAvailableRoomTypes(checkIn: Date, checkOut: Date) {
  const availableRoomTypes = await prisma.room_type.findMany({
    where: {
      rooms: {
        some: {
          is_available: true,
          bookings: {
            none: {
              OR: [
                {
                  check_in_at: {
                    lt: checkOut,
                  },
                  check_out_at: {
                    gt: checkIn,
                  },
                },
              ],
            },
          },
        },
      },
    },
    include: {
      rooms: { include: { bookings: true } },
    },
  });

  return availableRoomTypes;
}

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

  const availableRooms = await getAvailableRoomTypes(checkInDate, checkOutDate);

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
        availableRooms={availableRooms}
      />
    </PageContainer>
  );
}

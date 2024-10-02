import prisma from "@/lib/prisma";
import GuestsTable from "./components/table";

export default async function Receptionists() {
  const [guests] = await prisma.$transaction([
    prisma.user.findMany({
      where: { role: "GUEST" },
      include: { bookings: true },
    }),
  ]);

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2>Guest Accounts</h2>
          <p>See all the registered user accounts</p>
        </div>
      </div>
      <GuestsTable guests={guests} />
    </>
  );
}

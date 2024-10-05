import ReviewsTable from "./components/table";
import prisma from "@/lib/prisma";

export default async function Reviews() {
  const reviews = await prisma.review.findMany({
    include: {
      booking: {
        select: {
          check_in_at: true,
          check_out_at: true,
          guest: { select: { name: true } },
        },
      },
    },
  });

  return (
    <>
      <>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2>Guest Accounts</h2>
            <p>See all the registered user accounts</p>
          </div>
        </div>
        <ReviewsTable reviews={reviews} />
      </>
    </>
  );
}

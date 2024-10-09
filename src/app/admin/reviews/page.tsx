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
            <h2>Reviews</h2>
            <p>See all the reviews for Wikusama Hotel.</p>
          </div>
        </div>
        <ReviewsTable reviews={reviews} />
      </>
    </>
  );
}

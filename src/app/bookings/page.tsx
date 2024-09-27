import PageContainer from "@/components/layout/PageContainer";
import SectionContainer from "@/components/layout/SectionContainer";
import { buttonVariants } from "@/components/ui/button";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

export default async function Bookings() {
  const session = await getServerSession();
  const bookings = await prisma.booking.findMany({
    where: { guestId: session?.user?.id },
  });

  return (
    <PageContainer>
      <SectionContainer id="bookings" className="pt-0">
        <div className="w-full text-white">
          <div className="mb-12 flex items-center gap-8">
            <Link
              href={"/"}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "group w-fit",
              )}
            >
              <FaArrowLeft className="mr-1 transition-transform duration-300 group-hover:-translate-x-1" />{" "}
              Back
            </Link>
            <div className="block text-white">
              <h1 className="mb-3">Bookings History</h1>
              <p>
                You can view the booking details that you got from booking rooms
                in Wikusama Hotel.
              </p>
            </div>
          </div>
          {bookings.length === 0 && <p>There&apos;s no bookings...</p>}
        </div>
      </SectionContainer>
    </PageContainer>
  );
}

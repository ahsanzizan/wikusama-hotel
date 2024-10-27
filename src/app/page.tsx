import PageContainer from "@/components/layout/PageContainer";
import prisma from "@/lib/prisma";
import { CTA } from "./components/CTA";
import { Facilities } from "./components/Facilities";
import { Hero } from "./components/Hero";
import { Rooms } from "./components/Rooms";
import { Testimonies } from "./components/Testimonies";
import Pictures from "./components/Pictures";

export default async function Home() {
  const [roomTypes, reviews] = await prisma.$transaction([
    prisma.room_type.findMany({
      include: { rooms: { include: { bookings: true } } },
      take: 3,
    }),
    prisma.review.findMany({ take: 3 }),
  ]);

  return (
    <PageContainer>
      <Hero />
      <Facilities />
      <Pictures />
      <Rooms roomTypes={roomTypes} />
      <Testimonies reviews={reviews} />
      <CTA />
    </PageContainer>
  );
}

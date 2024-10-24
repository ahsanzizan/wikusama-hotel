import SectionContainer from "@/components/layout/SectionContainer";
import { stringifyDate } from "@/lib/utils";
import { review } from "@prisma/client";
import { Quote, Star } from "lucide-react";

function TestimonyCard({
  testimony,
  date,
  name,
  rate,
}: {
  testimony: string;
  date: Date;
  name: string;
  rate: number;
}) {
  return (
    <div className="rounded-lg border border-neutral-500 px-8 py-7">
      <div className="mb-8 flex items-center justify-between">
        <p>
          <time dateTime={date.toDateString()}>{stringifyDate(date)}</time>
        </p>
        <div className="flex items-center gap-1">
          {Array.from({ length: rate }).map((_, index) => (
            <Star key={index} />
          ))}
        </div>
      </div>
      <p className="mb-7 leading-5">
        <Quote className="mb-1" />
        {testimony}
      </p>
      <div className="flex items-center gap-4">
        <p className="text-lg font-medium">
          by <span className="text-white">{name}</span>
        </p>
      </div>
    </div>
  );
}

export function Testimonies({ reviews }: { reviews: review[] }) {
  return (
    <SectionContainer id="testimonies">
      <div className="mb-12 w-full text-center">
        <h1 className="mb-3">Our Guest Says</h1>
        <p>We made sure our guests is satisfied with our service.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
        {reviews.map((review) => (
          <TestimonyCard
            key={review.id}
            name={review.guest_name}
            date={review.submitted_at}
            testimony={review.testimony}
            rate={review.rate}
          />
        ))}
      </div>
      {reviews.length === 0 && (
        <p className="w-full text-center">There is no testimonies yet...</p>
      )}
    </SectionContainer>
  );
}

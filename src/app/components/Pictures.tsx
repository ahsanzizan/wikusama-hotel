import SectionContainer from "@/components/layout/SectionContainer";
import { cn } from "@/lib/utils";
import Image from "next/image";

function PresetImage({
  src,
  className,
  alt,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={400}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

export default function Pictures() {
  return (
    <SectionContainer id="pictures">
      <div className="mb-12 w-full text-center">
        <h1 className="mb-3">Our Inside Pictures</h1>
        <p>Explore stunning snapshots from in and around our premises</p>
      </div>
      <div className="flex w-full flex-col gap-5">
        <div className="grid w-full grid-cols-2 gap-5">
          <PresetImage src={"/pictures/1.jpg"} alt="1" />
          <div className="flex h-full flex-col justify-between gap-5">
            <PresetImage src={"/pictures/2.jpg"} alt="2" />
            <PresetImage src={"/pictures/3.jpg"} alt="3" />
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-5">
          <div className="flex h-full flex-col justify-between gap-5">
            <PresetImage src={"/pictures/4.jpg"} alt="4" />
            <PresetImage src={"/pictures/5.jpg"} alt="5" />
          </div>
          <PresetImage src={"/pictures/6.jpg"} alt="6" />
        </div>
      </div>
    </SectionContainer>
  );
}

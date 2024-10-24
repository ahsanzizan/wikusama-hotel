import SectionContainer from "@/components/layout/SectionContainer";
import {
  Dumbbell,
  Gamepad,
  Lightbulb,
  ParkingCircle,
  WashingMachine,
  Wifi,
} from "lucide-react";
import { ReactNode } from "react";
import { FaSwimmer } from "react-icons/fa";
import { FaBowlFood } from "react-icons/fa6";

function FacilityDisplay({
  icon,
  facilityTitle,
}: {
  icon: ReactNode;
  facilityTitle: string;
}) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-md px-16 py-10 transition-all duration-300 hover:bg-white hover:text-black">
      {icon}
      <p className="text-center">{facilityTitle}</p>
    </div>
  );
}

export function Facilities() {
  const facilities = [
    { icon: <FaSwimmer className="size-10" />, title: "Swimming Pool" },
    { icon: <Wifi className="size-10" />, title: "WiFi" },
    { icon: <FaBowlFood className="size-10" />, title: "Breakfast and Lunch" },
    { icon: <Dumbbell className="size-10" />, title: "Gym Center" },
    { icon: <Gamepad className="size-10" />, title: "Game Center" },
    { icon: <Lightbulb className="size-10" />, title: "24/7 Light" },
    { icon: <WashingMachine className="size-10" />, title: "Laundry" },
    { icon: <ParkingCircle className="size-10" />, title: "Parking Space" },
  ];

  return (
    <SectionContainer id="facilities">
      <div className="mb-12 w-full text-center">
        <h1 className="mb-3">Our Facilities</h1>
        <p>We offer modern 5 stars hotel facilities for your content.</p>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-x-4">
        {facilities.map((facility, index) => (
          <FacilityDisplay
            key={index}
            icon={facility.icon}
            facilityTitle={facility.title}
          />
        ))}
      </div>
    </SectionContainer>
  );
}

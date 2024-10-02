import PageContainer from "@/components/layout/PageContainer";
import PageHeading from "@/components/layout/PageHeading";
import Image from "next/image";

export default function Tour() {
  function FacilityCard({
    title,
    description,
    image,
  }: {
    title: string;
    description: string;
    image: string;
  }) {
    return (
      <div className="relative h-[570px] w-full">
        <Image
          src={image}
          width={1272}
          height={570}
          alt="Luxurious Rooms"
          className="h-[570px] w-full min-w-full object-cover"
        />
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 rounded-md bg-white p-5 text-center text-black shadow-md">
          <h2 className="mb-3">{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    );
  }

  const facilities = [
    {
      title: "Luxurious Rooms",
      description:
        "The elegant luxury bedrooms in this gallery showcase custom interior designs & decorating ideas. View pictures and find your perfect luxury bedroom design. Luxurious bedrooms that will make you never want to leave your room again. See more ideas about luxurious bedrooms, bedroom design",
      image: "/room-sample.jpg",
    },
    {
      title: "Sports Center",
      description:
        "The elegant luxury bedrooms in this gallery showcase custom interior designs & decorating ideas. View pictures and find your perfect luxury bedroom design.Luxurious bedrooms that will make you never want to leave your room again. See more ideas about luxurious bedrooms, bedroom design",
      image: "/gym-sample.jpg",
    },
    {
      title: "Luxurious Restaurants",
      description:
        "The elegant luxury bedrooms in this gallery showcase custom interior designs & decorating ideas. View pictures and find your perfect luxury bedroom design. Luxurious bedrooms that will make you never want to leave your room again. See more ideas about luxurious bedrooms, bedroom design",
      image: "/restaurant-sample.jpg",
    },
  ];

  return (
    <PageContainer className="pb-28">
      <PageHeading title="Take a Tour" description="" backHref="/" />
      <div className="flex w-full flex-col gap-[134px]">
        {facilities.map((facility, index) => (
          <FacilityCard key={index} {...facility} />
        ))}
      </div>
    </PageContainer>
  );
}

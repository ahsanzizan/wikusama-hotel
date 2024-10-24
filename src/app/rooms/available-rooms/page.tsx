import { notFound } from "next/navigation";

export default function AvailableRooms({
  params,
}: {
  params: { check_in: string; check_out: string };
}) {
  const { check_in, check_out } = params;
  if (!check_in || !check_out) return notFound();

  const checkInDate = new Date(check_in);
  const checkOutDate = new Date(check_out);
  console.log(checkInDate, checkOutDate);

  return <></>;
}

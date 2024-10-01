import PageContainer from "@/components/layout/PageContainer";
import UpdateProfileForm from "./components/form";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Profile() {
  const session = await getServerSession();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
  });

  if (!user) return notFound();
  const usingGoogle = user.password === null;

  return (
    <PageContainer>
      <UpdateProfileForm
        name={user.name}
        gender={user.gender}
        birthDate={user.birth_date}
        cityOfResidence={user.city_of_residence}
        mobileNumber={user.mobile_number}
        email={user.email}
        usingGoogle={usingGoogle}
      />
    </PageContainer>
  );
}

import PageContainer from "@/components/layout/PageContainer";
import UpdateProfileForm from "./components/form";
import { getServerSession } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageHeading from "@/components/layout/PageHeading";

export default async function Profile() {
  const session = await getServerSession();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
  });

  if (!user) return notFound();
  const usingGoogle = user.password === null;

  return (
    <PageContainer className="max-w-lg">
      <PageHeading
        title="Update Profile"
        description="Update your profile to skip some parts of the registration step in your check-in session."
        backHref="/"
        isSmall
      />
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

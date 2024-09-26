import prisma from "@/lib/prisma";
import ReceptionistsTable from "./components/table";

export default async function Receptionists() {
  const [receptionists] = await prisma.$transaction([
    prisma.user.findMany({ where: { role: "RECEPTIONIST" } }),
  ]);

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2>Receptionist Accounts</h2>
          <p>Create and edit receptionist accounts</p>
        </div>
      </div>
      <ReceptionistsTable receptionists={receptionists} />
    </>
  );
}

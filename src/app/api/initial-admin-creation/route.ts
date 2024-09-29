import { generateHash } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// This route is only used once to create an
// admin-privilleged user at the initial stage of the application
export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const adminCreationPassword = data.get("admin_creation_password") as
      | string
      | undefined;
    if (!adminCreationPassword)
      return NextResponse.json(
        {
          status: 403,
          message: "Admin creation password must be provided!",
        },
        { status: 403 },
      );

    if (adminCreationPassword !== process.env.ADMIN_CREATION_PASSWORD)
      return NextResponse.json({
        status: 403,
        message:
          "Admin creation password does not match the one provided in the environment variables.",
      });

    const admin = {
      name: "Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    };
    await prisma.user.create({
      data: {
        name: admin.name,
        email: admin.email,
        password: generateHash(admin.password),
        verified: true,
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      status: 201,
      message: `An admin with email ${admin.email} has been created.`,
    });
  } catch (error) {
    return NextResponse.json({
      status: 403,
      message:
        "Admin creation password does not match the one provided in the environment variables.",
    });
  }
}

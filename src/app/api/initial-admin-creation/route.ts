import { generateHash } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const adminCreationSchema = z.object({
  name: z.string().min(1, "name must be provided!"),
  email: z.string().email().min(1, "email must be provided!"),
  password: z.string().min(8, "password must be at least 8 characters!"),
  adminCreationPassword: z
    .string()
    .min(1, "admin_creation_password must be provided!"),
});

// This route is only used once to create an
// admin-privilleged user at the initial stage of the application
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const admin = {
      name: formData.get("name") as string | undefined,
      email: formData.get("email") as string | undefined,
      password: formData.get("password") as string | undefined,
      adminCreationPassword: formData.get("admin_creation_password") as
        | string
        | undefined,
    };

    const { name, email, password, adminCreationPassword } =
      adminCreationSchema.parse(admin);

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

    await prisma.user.create({
      data: {
        name,
        email,
        password: generateHash(password),
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

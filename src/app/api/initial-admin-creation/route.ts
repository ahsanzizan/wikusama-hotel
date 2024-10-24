import { generateHash } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const adminCreationSchema = z.object({
  name: z.string().min(1, "name must be provided!"),
  email: z.string().email().min(1, "email must be provided!"),
  password: z.string().min(8, "password must be at least 8 characters!"),
  admin_creation_password: z
    .string()
    .min(1, "admin_creation_password must be provided!"),
});

type AdminCreateInput = z.infer<typeof adminCreationSchema>;

// This route is only used once to create an
// admin-privilleged user at the initial stage of the application
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AdminCreateInput;
    if (!body)
      return NextResponse.json(
        {
          status: 403,
          message: "Body must be provided!",
        },
        { status: 403 },
      );

    console.log(body);
    const { name, email, password, admin_creation_password } =
      adminCreationSchema.parse(body);

    if (!admin_creation_password)
      return NextResponse.json(
        {
          status: 403,
          message: "Admin creation password must be provided!",
        },
        { status: 403 },
      );

    if (admin_creation_password !== process.env.ADMIN_CREATION_PASSWORD)
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
      message: `An admin with email ${email} has been created.`,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal server error",
    });
  }
}

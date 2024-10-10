"use server";
import { EmailService } from "@/lib/email-service";
import { generateHash } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { generateRandomString, verifyTemplate } from "@/lib/utils";
import { ServerActionResponse } from "@/types/server-action";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<ServerActionResponse<undefined>> {
  try {
    const { name, email, password } = data;

    const checkEmailExistence = await prisma.user.findUnique({
      where: { email },
    });
    if (checkEmailExistence)
      return { success: false, message: "Email has been used!" };

    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        password: generateHash(password),
        verification_token: generateRandomString(24),
      },
    });

    const emailService = new EmailService();
    await emailService.sendEmail({
      subject: "Verify your email for Wikusama Hotel",
      to: createdUser.email,
      html: verifyTemplate(
        createdUser.name,
        `${process.env.APP_URL}/auth/verify?token=${createdUser.verification_token}`,
      ),
    });

    return {
      success: true,
      message: "Successfully registered an account!",
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something is wrong!" };
  }
}

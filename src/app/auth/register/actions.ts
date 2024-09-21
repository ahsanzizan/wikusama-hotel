"use server";
import { createUser, findUser } from "@/database/user.query";
import { EmailService } from "@/lib/email-service";
import { generateHash } from "@/lib/encryption";
import { generateRandomString, verifyTemplate } from "@/lib/utils";
import { ServerActionResponse } from "@/types/server-action";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<ServerActionResponse> {
  try {
    const { name, email, password } = data;

    const checkEmailExistence = await findUser({ email });
    if (checkEmailExistence)
      return { success: false, message: "Email telah digunakan!" };

    const createdUser = await createUser({
      name,
      email,
      password: generateHash(password as string),
      verificationToken: generateRandomString(14),
    });

    const emailService = new EmailService();
    await emailService.sendEmail({
      subject: "Verify your email for Digifest",
      to: createdUser.email,
      html: verifyTemplate(
        createdUser.name,
        `${process.env.APP_URL}/auth/verify?token=${createdUser.verificationToken}`,
      ),
    });

    return {
      success: true,
      message: "Berhasil mendaftarkan user!",
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Gagal mendaftarkan user!" };
  }
}
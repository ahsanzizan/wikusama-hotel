"use server";
import { findUser } from "@/database/user.query";
import { ServerActionResponse } from "@/types/server-action";

// TODO: Change this to login logic (check for email existence)
export async function checkVerifiedStatus(data: {
  email: string;
  password: string;
}): Promise<ServerActionResponse> {
  try {
    const { email, password } = data;

    const user = await findUser({ email });
    if (!user) return { success: false, message: "Email is not registered!" };

    if (!user.verified)
      return { success: false, message: "Verify your account first!" };

    return {
      success: true,
      message: "Successfully validated verification status!",
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something is wrong!" };
  }
}

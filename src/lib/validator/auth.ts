import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email must be filled!" })
    .email("Invalid email!"),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters!" }),
});

export const registerFormSchema = z.object({
  name: z.string().min(1, { message: "Name must be filled!" }),
  email: z
    .string()
    .min(1, { message: "Email must be filled!" })
    .email("Invalid email!"),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters!" }),
});

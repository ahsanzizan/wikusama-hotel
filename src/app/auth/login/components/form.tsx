"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useZodForm } from "@/hooks/useZodForm";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa6";
import { toast } from "sonner";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z.string().min(1, "Email must be filled!").email("Email is invalid!"),
  password: z.string().min(8, "Password must be atleast 8 characters!"),
});

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const form = useZodForm({ schema: loginFormSchema });
  const router = useRouter();

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const toastId = toast.loading("Loading...");

    const loginResult = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email: values.email,
      password: values.password,
    });

    if (loginResult?.error) {
      setLoading(false);
      return toast.error(
        loginResult.error === "CredentialsSignin"
          ? "Wrong email or password!"
          : "Something is wrong!",
        { id: toastId },
      );
    }

    toast.success("Successfully logged in!", { id: toastId });
    setLoading(false);
    return router.push(`/`);
  });

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Welcome Back!</CardTitle>
        <CardDescription>
          Login to your account to explore and book your stay at Wikusama Hotel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid w-full items-center gap-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Your email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Your password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-4 flex w-full flex-col items-center gap-4">
                <Button
                  type="submit"
                  variant={"default"}
                  className="w-full"
                  disabled={loading}
                >
                  Login
                </Button>
                <div className="flex w-full items-center justify-between">
                  <div className="h-[1px] w-full max-w-[45%] bg-neutral-300" />
                  <p className="text-xs">OR</p>
                  <div className="h-[1px] w-full max-w-[45%] bg-neutral-300" />
                </div>
                <Link
                  href={"/auth/register"}
                  className={cn(
                    "w-full",
                    buttonVariants({ variant: "outline" }),
                  )}
                >
                  Register
                </Link>
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => {
                    signIn("google", { callbackUrl: "/" });
                  }}
                  className="w-full"
                >
                  <FaGoogle className="mr-2" /> Login with Google
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

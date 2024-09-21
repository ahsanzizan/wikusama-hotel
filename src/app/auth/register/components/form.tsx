"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function RegisterForm() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Welcome Aboard!</CardTitle>
        <CardDescription>
          Register your account to explore and book your stay at Wikusama Hotel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={() => {}}>
          <div className="grid w-full items-center gap-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your full name" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Your email" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="Your password"
                type="password"
              />
            </div>
            <div className="mt-4 flex w-full flex-col items-center gap-4">
              <Button type="submit" variant={"default"} className="w-full">
                Register
              </Button>
              <div className="flex w-full items-center justify-between">
                <div className="h-[1px] w-full max-w-[45%] bg-neutral-300" />
                <p className="text-xs">OR</p>
                <div className="h-[1px] w-full max-w-[45%] bg-neutral-300" />
              </div>
              <Link
                href={"/auth/login"}
                className={cn("w-full", buttonVariants({ variant: "outline" }))}
              >
                Login
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

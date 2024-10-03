"use client";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useZodForm } from "@/hooks/useZodForm";
import { useEffect, useState } from "react";
import { z } from "zod";
import { submitReview } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next-nprogress-bar";

function createRatingSchema() {
  const ratingSchema = z.object({
    name: z.string().min(1, "Name must be filled!"),
    rate: z.string().min(1, "Rate must be filled!"),
    testimony: z.string().min(1, "Testimony must be filled!"),
  });

  return ratingSchema;
}

export default function ReviewForm({ bookingId }: { bookingId: string }) {
  const form = useZodForm({ schema: createRatingSchema() });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = form.handleSubmit(async ({ name, rate, testimony }) => {
    setLoading(true);

    const toastId = toast.loading("Loading...");
    const submissionResult = await submitReview({
      bookingId,
      name,
      rate: Number(rate),
      testimony,
    });

    if (!submissionResult.success) {
      setLoading(false);
      return toast.error(submissionResult.message, { id: toastId });
    }

    toast.success(submissionResult.message, { id: toastId });
    setLoading(false);
    return router.push("/bookings");
  });

  const rate = form.watch("rate");

  useEffect(() => {
    if (Number(rate) > 5) {
      form.setValue("rate", (5).toString());
    } else if (Number(rate) < 1) {
      form.setValue("rate", (1).toString());
    }
  }, [form, rate]);

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Rate Your Stay</CardTitle>
        <CardDescription>
          Ask the person who stayed at the booked room to fill in the form
          below. It will greatly help our effort on enhancing our
          customer&apos;s experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid w-full items-center gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="name">Guest Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Name of the guest" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="rate">Rating (1 - 5)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your rating"
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="testimony"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="testimony">Testimony</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Your testimony on our room"
                        className="h-[120px]"
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
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

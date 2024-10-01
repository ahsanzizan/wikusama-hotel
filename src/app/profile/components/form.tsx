"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useZodForm } from "@/hooks/useZodForm";
import { cn } from "@/lib/utils";
import { Gender } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { toast } from "sonner";
import validator from "validator";
import { z } from "zod";
import { deleteAccount, updateProfile } from "../actions";
import { FaGoogle } from "react-icons/fa6";
import { signOut } from "next-auth/react";

const createUpdateProfileSchema = () => {
  const updateProfileSchema = z.object({
    name: z.string().optional(),
    gender: z
      .string()
      .refine((gender) => Object.values(Gender).includes(gender as Gender), {
        message: "Gender must be either male or female!",
      })
      .optional(),
    birth_date: z.date({ message: "Birth date must be filled!" }).optional(),
    city_of_residence: z.string().optional(),
    mobile_number: z.string().refine(validator.isMobilePhone).optional(),
  });

  return updateProfileSchema;
};

type UpdateProfileFormProps = {
  name: string;
  gender: Gender | null;
  birthDate: Date | null;
  cityOfResidence: string | null;
  mobileNumber: string | null;
  email: string;
  usingGoogle: boolean;
};

export default function UpdateProfileForm({
  name,
  gender,
  birthDate,
  cityOfResidence,
  mobileNumber,
  email,
  usingGoogle,
}: UpdateProfileFormProps) {
  const form = useZodForm({
    schema: createUpdateProfileSchema(),
    defaultValues: {
      name,
      gender: !!gender ? gender : undefined,
      birth_date: !!birthDate ? birthDate : undefined,
      city_of_residence: !!cityOfResidence ? cityOfResidence : undefined,
      mobile_number: !!mobileNumber ? mobileNumber : undefined,
    },
  });
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const router = useRouter();

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const toastId = toast.loading("Loading...");

    const result = await updateProfile({
      ...values,
      gender: values.gender as Gender,
    });

    if (!result.success) {
      setLoading(false);
      return toast.error(result.message, { id: toastId });
    }

    toast.success(result.message, { id: toastId });
    setLoading(false);
    return router.push(`/`);
  });

  return (
    <>
      <div className="p-5 shadow-md">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your profile to help us improve our customer experience.
            </CardDescription>
            {usingGoogle && (
              <div className="flex w-full items-center gap-1.5 text-sm font-semibold text-black">
                <FaGoogle /> Using Google
              </div>
            )}
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
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              setIsButtonDisabled(false);
                              field.onChange(e);
                            }}
                            placeholder="Your name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input defaultValue={email} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Your Gender</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(e) => {
                              setIsButtonDisabled(false);
                              field.onChange(e);
                            }}
                            defaultValue={field.value}
                            className="flex flex-row items-center gap-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="MALE" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Male
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="FEMALE" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Female
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birth_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Birth Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(e) => {
                                setIsButtonDisabled(false);
                                field.onChange(e);
                              }}
                              captionLayout="dropdown-buttons"
                              disabled={(date) => date > new Date()}
                              fromYear={1960}
                              toYear={new Date().getFullYear()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city_of_residence"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-1.5">
                        <FormLabel htmlFor="city_of_residence">
                          City of Residence
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              setIsButtonDisabled(false);
                              field.onChange(e);
                            }}
                            placeholder="Your city of residence"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobile_number"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-1.5">
                        <FormLabel htmlFor="mobile_number">
                          Mobile Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              setIsButtonDisabled(false);
                              field.onChange(e);
                            }}
                            placeholder="Your mobile phone number"
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
                      disabled={loading || isButtonDisabled}
                    >
                      Update
                    </Button>
                    <Button
                      type="button"
                      onClick={async () => {
                        setLoading(true);

                        const toastId = toast.loading("Loading...");
                        const result = await deleteAccount();

                        if (!result.success) {
                          setLoading(false);
                          return toast.error(result.message, { id: toastId });
                        }

                        toast.success(result.message, {
                          id: toastId,
                        });

                        await signOut({
                          callbackUrl: "/",
                        });

                        setLoading(false);
                        return router.push(`/`);
                      }}
                      variant={"destructive"}
                      className="w-full"
                      disabled={loading}
                    >
                      Delete account
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

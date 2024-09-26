"use client";
import ModalContainer from "@/components/layout/ModalContainer";
import { Button } from "@/components/ui/button";
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
import { user } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { FaX } from "react-icons/fa6";
import { toast } from "sonner";
import { z } from "zod";
import { upsertReciptionist } from "../actions";
function createUserSchema() {
  const userSchema = z.object({
    name: z.string().min(1, "Name must be filled!"),
    email: z
      .string()
      .min(1, "Email must be filled!")
      .email("Email format is not valid!"),
    password: z.string().min(8, "Password must be filled!"),
  });

  return userSchema;
}

export default function ReceptionistModal({
  setIsOpenModal,
  data,
}: {
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  data: user | null;
}) {
  const [loading, setLoading] = useState(false);
  const form = useZodForm({
    defaultValues: {
      name: data?.name.toString(),
      email: data?.email,
    },
    schema: createUserSchema(),
  });
  const router = useRouter();

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const toastId = toast.loading("Loading...");
    const result = await upsertReciptionist(values, data?.id);

    if (!result.success) {
      setLoading(false);
      return toast.error(result.message, { id: toastId });
    }

    toast.success(result.message, { id: toastId });
    setIsOpenModal(false);
    setLoading(false);
    return router.refresh();
  });

  return (
    <ModalContainer>
      <div className="text-black">
        <div className="flex items-center justify-between border-b p-4 md:p-5">
          <h2>Receptionist Data</h2>
          <button
            className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 transition-all hover:bg-gray-200 hover:text-gray-900"
            onClick={() => setIsOpenModal(false)}
            type="button"
          >
            <FaX size={16} />
          </button>
        </div>
        <Form {...form}>
          <form onSubmit={onSubmit} className="p-5 text-black">
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
                        placeholder="Receptionist's name"
                        className="border-neutral-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Receptionist's email"
                        className="border-neutral-300"
                      />
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
                        placeholder="Password for the account"
                        className="border-neutral-300"
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
                  Confirm
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </ModalContainer>
  );
}

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
import { FileField, Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useZodForm } from "@/hooks/useZodForm";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/utils";
import { room_type } from "@prisma/client";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { upsertRoomType } from "../actions";

function createRoomTypeSchema(isUpdating: boolean) {
  const photoSchema = z
    .instanceof(FileList)
    .refine((files) => {
      return isUpdating ? true : files.length !== 0;
    }, "Photo must be filled!")
    .refine((files) => {
      // Select only the first file
      const file = files[0];
      // If file size exceed the maximum limit, then throw error
      if (!isUpdating) return file?.size <= MAX_FILE_SIZE;
      return !file || file?.size <= MAX_FILE_SIZE;
    }, `Maximum file size is 5MB`)
    .refine((files: FileList) => {
      // Select only the first file
      const file = files[0];
      // If file's extension is not allowed, then throw error
      if (!isUpdating) return ACCEPTED_IMAGE_TYPES.includes(file?.type);
      return !file || ACCEPTED_IMAGE_TYPES.includes(file?.type);
    });

  const roomTypeSchema = z.object({
    type_name: z.string().min(1, "Type name must be filled!"),
    price_per_night: z.string().min(1, "Price per-night must be filled!"),
    discount_percent: z.string().min(1, "Discount must be filled!"),
    photo: photoSchema,
    description: z.string().min(1, "Description must be filled!"),
  });

  return roomTypeSchema;
}

export default function RoomTypeModal({
  setIsOpenModal,
  data,
}: {
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  data: room_type | null;
}) {
  const [loading, setLoading] = useState(false);
  const form = useZodForm({
    defaultValues: {
      type_name: data?.type_name,
      description: data?.description,
      discount_percent: data?.discount_percent.toString(),
      photo: undefined,
      price_per_night: data?.price_per_night.toString(),
    },
    schema: createRoomTypeSchema(data !== null),
  });
  const router = useRouter();

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const photoFile = values.photo ? values.photo[0] : undefined;
    const toastId = toast.loading("Loading...");

    const formData = new FormData();
    formData.append("type_name", values.type_name);
    formData.append("description", values.description);
    formData.append("price_per_night", values.price_per_night);
    formData.append("discount_percent", values.discount_percent);
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    const result = await upsertRoomType(formData, data?.id);

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
          <h2>Room Type Data</h2>
          <button
            className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 transition-all hover:bg-gray-200 hover:text-gray-900"
            onClick={() => setIsOpenModal(false)}
            type="button"
          >
            <X size={16} />
          </button>
        </div>
        <Form {...form}>
          <form onSubmit={onSubmit} className="p-5 text-black">
            <div className="grid w-full items-center gap-y-4">
              <FormField
                control={form.control}
                name="type_name"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="type_name">Type Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Room type's name"
                        className="border-neutral-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Room type's description"
                        className="border-neutral-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price_per_night"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="price_per_night">
                      Price per-night
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Price per-night"
                        className="border-neutral-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount_percent"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="discount_percent">
                      Discount Percentage
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Discount percentage"
                        className="border-neutral-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FileField
                name="photo"
                label="Photo"
                register={form.register}
                accept={ACCEPTED_IMAGE_TYPES.reduce(
                  (prev, curr) => prev + ", " + curr,
                )}
                errorMessage={form.formState.errors.photo?.message?.toString()}
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

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useZodForm } from "@/hooks/useZodForm";
import { roomWithBookingsAndType } from "@/types/relations";
import { room_type } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { FaX } from "react-icons/fa6";
import { toast } from "sonner";
import { z } from "zod";
import { upsertRoom } from "../actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function createRoomSchema() {
  const roomSchema = z.object({
    room_number: z.string().min(1, "Room number must be filled!"),
    is_available: z.string().min(1, "Availability must be filled!"),
    room_typeId: z.string().min(1, "Room type must be filled!"),
  });

  return roomSchema;
}

export default function RoomModal({
  setIsOpenModal,
  data,
  roomTypes,
}: {
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  data: roomWithBookingsAndType | null;
  roomTypes: room_type[];
}) {
  const [loading, setLoading] = useState(false);
  const form = useZodForm({
    defaultValues: {
      room_number: data?.room_number.toString(),
      is_available: data?.is_available === true ? "YES" : "NO",
      room_typeId: data?.room_typeId,
    },
    schema: createRoomSchema(),
  });
  const router = useRouter();

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);

    const toastId = toast.loading("Loading...");
    const result = await upsertRoom(
      {
        room_number: Number(values.room_number),
        is_available: values.is_available === "YES",
        room_typeId: values.room_typeId,
      },
      data?.id,
    );

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
          <h2>Room Data</h2>
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
                name="room_number"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel htmlFor="type_name">Room Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Room's number"
                        className="border-neutral-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_available"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Is the room available?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="YES" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="NO" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="room_typeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border border-neutral-300">
                          <SelectValue placeholder="Select a room type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomTypes.map((roomType) => (
                          <SelectItem key={roomType.id} value={roomType.id}>
                            {roomType.type_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

export function GuestForm({
  form,
}: {
  form: UseFormReturn<{
    room_count: string;
    check_in_at: Date;
    check_out_at: Date;
    guest_full_name: string;
    guest_email: string;
    guest_phone_number: string;
    guest_address: string;
  }>;
}) {
  return (
    <>
      <h4>Guest Data</h4>
      <FormField
        control={form.control}
        name="guest_full_name"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-1.5">
            <FormLabel htmlFor="guest_full_name">Fullname</FormLabel>
            <FormControl>
              <Input {...field} placeholder="The guest's fullname" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="guest_email"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-1.5">
            <FormLabel htmlFor="guest_email">Email</FormLabel>
            <FormControl>
              <Input {...field} placeholder="The guest's email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="guest_phone_number"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-1.5">
            <FormLabel htmlFor="guest_phone_number">
              Phone Number (08xxxxxxxxxx)
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="The guest's phone number" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="guest_address"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-1.5">
            <FormLabel htmlFor="guest_address">Address</FormLabel>
            <FormControl>
              <Input {...field} placeholder="The guest's address" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

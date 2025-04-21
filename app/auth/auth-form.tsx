"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type AuthFormProps = {
  name: string;
};

export function AuthForm({ name }: AuthFormProps) {
  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      name,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      await authClient.updateUser({
        name: values.name,
      });
    },
    onError: (error) => {
      // Handle error, e.g., show a toast notification
      console.error("Update user error:", error);
      // You might want to add user feedback here, like a toast message
    },
    // You can add onSuccess, onSettled callbacks as needed
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="w-full mt-4" disabled={isPending}>
        {isPending ? "Processing..." : "Continue"}
      </Button>
    </Form>
  );
}

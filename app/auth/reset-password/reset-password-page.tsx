"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEventHandler } from "react";
import { toast } from "sonner";

export function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;
  const router = useRouter();

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      return authClient.resetPassword({
        token: token,
        newPassword: password,
      });
    },
    onSuccess: () => {
      router.push("/auth/signin");
      router.refresh();
    },
    onError: (error: { message: string }) => {
      toast.error(error.message);
    },
  });

  const forgetPasswordMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      return authClient.forgetPassword({
        email,
        redirectTo: "/auth/reset-password",
      });
    },
    onSuccess: () => {
      router.push("/auth/verify");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message);
    },
  });

  const handleSubmitPassword: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    resetPasswordMutation.mutate({ password });
  };

  const handleSubmitEmail: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    forgetPasswordMutation.mutate({ email });
  };

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reset Password email</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <form className="space-y-5" onSubmit={handleSubmitEmail}>
            <div className="space-y-4">
              <div className="*:not-first:mt-2">
                <Label htmlFor={`email`}>email</Label>
                <Input
                  id={`email`}
                  placeholder="Enter your email"
                  type="email"
                  required
                  name="email"
                />
              </div>
            </div>
            <Button
              disabled={forgetPasswordMutation.isPending}
              type="submit"
              className="w-full"
            >
              Receive token
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>{token}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form className="space-y-5" onSubmit={handleSubmitPassword}>
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor={`password`}>Password</Label>
              <Input
                id={`password`}
                placeholder="Enter your password"
                type="password"
                required
                name="password"
              />
            </div>
          </div>
          <Button
            disabled={resetPasswordMutation.isPending}
            type="submit"
            className="w-full"
          >
            Reset Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEventHandler } from "react";
import { toast } from "sonner";
import { SignInWithGitHub } from "../SignInWithGitHub";
import { SignInWithGoogle } from "../SignInWithGoogle";

export default function SignUpPage() {
  const router = useRouter();

  const signUpMutation = useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      return authClient.signUp.email({
        email,
        name,
        password,
        callbackURL: "/auth",
      });
    },
    onSuccess: () => {
      router.push("/auth");
      router.refresh();
    },
    onError: (error: { message: string }) => {
      toast.error(error.message);
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    signUpMutation.mutate({ name, email, password });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>
          We just need a few details to get you started.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor={`name`}>Full name</Label>
              <Input
                id={`name`}
                placeholder="Matt Welsh"
                type="text"
                required
                name="name"
              />
            </div>
            <div className="*:not-first:mt-2">
              <Label htmlFor={`email`}>Email</Label>
              <Input
                id={`email`}
                placeholder="hi@yourcompany.com"
                type="email"
                required
                name="email"
              />
            </div>
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
            disabled={signUpMutation.isPending}
            type="submit"
            className="w-full"
          >
            Sign up
          </Button>
        </form>

        <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
          <span className="text-muted-foreground text-xs">Or</span>
        </div>

        <div className="flex items-center gap-2 justify-">
          <SignInWithGitHub />
          <SignInWithGoogle />
        </div>

        <p className="text-muted-foreground text-center text-xs">
          Already have an account?{" "}
          <Link className="text-indigo-500" href="/auth/signin">
            Sing In.
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

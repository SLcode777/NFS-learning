"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon } from "lucide-react";
import { useState } from "react";
import { setPasswordAction } from "./share.action";

interface PasswordFormProps {
  itemId: string;
}

export function PasswordForm({ itemId }: PasswordFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      await setPasswordAction({
        itemId,
        password,
      });
    } catch {
      setError("Invalid password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-20 px-4">
      <Card className="shadow-none border">
        <CardHeader className="space-y-1 pb-6 pt-6 px-6 border-b">
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <LockIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-lg font-medium text-center">
            Password Protected
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            This file is protected with a password
          </p>
        </CardHeader>

        <CardContent className="pt-6 px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={isLoading}
                className="h-9"
              />
              {error && (
                <Alert variant="destructive" className="py-2 text-sm">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Verifying..." : "Continue"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="py-3 px-6 border-t bg-muted/20 flex justify-center">
          <p className="text-xs text-muted-foreground">
            Contact the owner for password assistance
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

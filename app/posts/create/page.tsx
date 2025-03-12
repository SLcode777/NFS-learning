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
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { FormEventHandler } from "react";
import { toast } from "sonner";

export default function CreatePostPage() {
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title: formData.get("title"),
          content: formData.get("content"),
        }),
      });

      if (!res.ok) throw new Error("Failed to create post");

      toast.success("Post created!");
      router.push("/posts");
      router.refresh();
    } catch {
      toast.error("Failed to create post");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new post</CardTitle>
        <CardDescription>Share your thoughts with the world</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter post title"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your post content..."
              required
              className="min-h-[200px]"
            />
          </div>

          <Button type="submit" className="w-full">
            Create Post
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

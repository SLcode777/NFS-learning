"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadDropzone } from "@/components/upload-dropzone";
import { UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UploadButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UploadIcon className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a file to your collection
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <UploadDropzone
            onClientUploadComplete={() => {
              setOpen(false);
              router.refresh();
            }}
            onUploadError={(error) => {
              console.error(error);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

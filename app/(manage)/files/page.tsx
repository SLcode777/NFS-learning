import { FilesList } from "@/components/files/files-list";
import { UploadButton } from "@/components/files/upload-button";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getRequiredUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { UploadIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function FilesPage() {
  const user = await getRequiredUser();
  const filesCount = await prisma.item.count({ where: { userId: user.id } });

  const canUploadFiles = filesCount < user.limitation.files;

  //I need to disable the password and price fields in the file edit form based on the user plan (see correction video at 5:22)
  //https://codeline.app/cdly/courses/nextfullstack/lessons/les_MFCXB2mgF4

  return (
    <div className="container py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Files ({filesCount})</h1>
        {canUploadFiles ? (
          <UploadButton />
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-muted-foreground text-background hover:bg-muted-foreground hover:text-background">
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Storage Limit Reached</DialogTitle>
                <DialogDescription>
                  You have reached your storage limit of {user.limitation.files}{" "}
                  files. Please upgrade your plan to upload more files.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Link
                  className={buttonVariants({ size: "lg" })}
                  href="/pricing"
                >
                  Upgrade plan
                </Link>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <FilesList />
      </Suspense>
    </div>
  );
}

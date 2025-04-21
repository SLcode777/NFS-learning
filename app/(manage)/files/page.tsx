import { FilesList } from "@/components/files/files-list";
import { UploadButton } from "@/components/files/upload-button";
import { Suspense } from "react";

export default async function FilesPage() {
  return (
    <div className="container py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Files</h1>
        <UploadButton />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <FilesList />
      </Suspense>
    </div>
  );
}

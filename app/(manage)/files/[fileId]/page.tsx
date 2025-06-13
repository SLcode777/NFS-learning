export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { FileEditForm } from "@/components/files/file-edit-form";
import { getRequiredUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface FilePageProps {
  params: Promise<{
    fileId: string;
  }>;
}

export default async function FilePage({ params }: FilePageProps) {
  const user = await getRequiredUser();
  const { fileId } = await params;

  const file = await prisma.item.findUnique({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) {
    notFound();
  }

  return (
    <div className="container py-10 max-w-2xl space-y-8">
      <FileEditForm file={file} limitations={user.limitation} />
    </div>
  );
}

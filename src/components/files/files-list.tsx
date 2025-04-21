import { FileCard } from "@/components/files/file-card";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export async function FilesList() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const files = await prisma.item.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (files.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No files uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {files.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  );
}

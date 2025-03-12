import { getRequiredUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ postId: string; commentId: string }> }
) {
  const user = await getRequiredUser();

  const params = await context.params;

  const comment = await prisma.comment.findUnique({
    where: {
      id: parseInt(params.commentId),
      userId: user.id,
    },
  });

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  await prisma.comment.delete({
    where: {
      id: parseInt(params.commentId),
    },
  });

  return NextResponse.json({ success: true });
}

import { getRequiredUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Qui à le droit de faire ça ?
// Je sécurise bien l'API Route ??
export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  // UTILISATEUR QUI EST ACTUELLEMENT CONNECTER
  const user = await getRequiredUser();

  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(params.postId),
      // userId: user.id,
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.userId !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.post.delete({
    where: {
      id: parseInt(params.postId),
    },
  });

  return NextResponse.json({ success: true });
}

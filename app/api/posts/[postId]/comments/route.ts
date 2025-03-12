import { getRequiredUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const user = await getRequiredUser();

  const body = await req.json();
  const { content } = body;

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId: parseInt(params.postId),
      userId: user.id,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return NextResponse.json(comment);
}

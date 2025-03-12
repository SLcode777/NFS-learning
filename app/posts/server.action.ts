"use server";

import { getRequiredUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export const deleteCommentAction = async (commentId: number) => {
  const user = await getRequiredUser();

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
      userId: user.id,
    },
  });

  if (!comment) {
    return {
      error: "No comment found",
      data: null,
    };
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return {
    error: null,
    data: { commentId },
  };
};

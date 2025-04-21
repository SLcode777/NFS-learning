"use server";

import { actionClient } from "@/lib/safe-action";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export const setPasswordAction = actionClient
  .schema(
    z.object({
      itemId: z.string(),
      password: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    const { itemId, password } = parsedInput;

    const cookieList = await cookies();

    cookieList.set("itemId-password", password);

    redirect(`/share/${itemId}`);
  });

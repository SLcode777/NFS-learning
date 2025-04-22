import { userAction } from "@/lib/safe-action";
import { z } from "zod";

export const upgradePlan = userAction
  .schema(
    z.object({
      priceId: z.string(),
    })
  )
  .action(async ({ parsedInput: { priceId }, ctx }) => {
    const { user } = ctx;

    return {
      user,
      priceId,
      success: true,
      message: "Plan upgraded successfully",
    };
  });

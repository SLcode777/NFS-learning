"use server";

import { prisma } from "@/lib/prisma";
import { userAction } from "@/lib/safe-action";
import { stripe } from "@/lib/stripe";
import { z } from "zod";
import { PRICES } from "./pricing.data";

export const upgradePlan = userAction
  .schema(
    z.object({
      priceId: z.string(),
    })
  )
  .action(async ({ parsedInput: { priceId }, ctx }) => {
    const { user } = ctx;

    console.log("priceId in action.ts = ", priceId);

    const plan = PRICES.find(
      (p) => p.monthlyPriceId === priceId || p.yearlyPriceId === priceId
    );

    if (!plan) {
      throw new Error("invalid plan");
    }

    console.log("plan in action.ts = ", plan);

    const { stripeCustomerId } = await prisma.user.findUniqueOrThrow({
      where: {
        id: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!stripeCustomerId) {
      throw new Error("stripe cutomer id not found");
    }

    const stripeCheckout = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/pricing",
    });

    return {
      user,
      priceId,
      success: true,
      message: "Plan upgraded successfully",
      url: stripeCheckout.url,
    };
  });

  //see correction video at 04:40 to finish the stripe checkout setup

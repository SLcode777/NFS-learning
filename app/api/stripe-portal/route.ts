import { getRequiredUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST() {
  const user = await getRequiredUser();
  const stripeCustomerId = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    select: {
      stripeCustomerId: true,
    },
  });

  if (!stripeCustomerId) {
    throw new Error("no stripe customer id found");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId as unknown as string,
    return_url: "http://localhost:3000/user/billing",
  });

  return NextResponse.json({ url: session.url });
}

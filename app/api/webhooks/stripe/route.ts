import { UserPlan } from "@/lib/generated/client";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (req: NextRequest) => {
  const headerList = await headers();
  const body = await req.text();

  const stripeSignature = headerList.get("stripe-signature");

  let event: Stripe.Event | null = null;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      stripeSignature ?? "",
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("payment intent was successful!", paymentIntent);
        break;
      case "checkout.session.completed":
        const checkoutSession = event.data.object;
        const customer = checkoutSession.customer as string;
        const metadata = checkoutSession.metadata;
        const plan = metadata?.plan;

        if (!plan) {
          throw new Error("no plan in metadata");
        }

        console.log("checkoutSession completed ! : ", checkoutSession);
        console.log("chekoutSession customer", customer);
        console.log("checkoutSession plan", plan);

        console.log("prisma db update...");

        await prisma.user.update({
          where: {
            stripeCustomerId: customer,
          },
          data: {
            plan: plan as UserPlan,
          },
        });

        console.log("prisma db updated");

        break;
      case "customer.subscription.updated":
        const updateSubscription = event.data.object;
        const customer2 = updateSubscription.customer as string;
        const metadata2 = updateSubscription.metadata;
        const plan2 = metadata2?.plan;

        console.log("update sub : ", updateSubscription);
        console.log("prisma db update...");

//watch correction video at 6:50 to see the end of exercise

        await prisma.user.update({
          where: {
            stripeCustomerId: customer2,
          },
          data: {
            plan: plan2 as UserPlan,
          },
        });

        console.log("prisma db updated");

        break;
      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object;
        const customer3 = deletedSubscription.customer as string;

        const isActive2 = deletedSubscription.status === "active";

        if (!isActive2) {
          console.log("prisma db update...");

          await prisma.user.update({
            where: {
              stripeCustomerId: customer3,
            },
            data: {
              plan: "FREE",
            },
          });
        }
        console.log("deleted sub : ", deletedSubscription);
        console.log("prisma db updated !");

        break;
      default:
        console.log(`unhandled event type ${event.type}`);
    }
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
};

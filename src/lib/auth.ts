import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins/magic-link";
import Stripe from "stripe";
import { prisma } from "./prisma";
import { resend } from "./resend";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  appName: "prisma-auth-app",
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        to: user.email,
        from: "nextfullstack@nowts.app",
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          to: email,
          from: "nextfullstack@nowts.app",
          subject: "Magic Link",
          text: `Hello, click here : ${url}`,
        });
      },
    }),
    nextCookies(),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return { data: { ...user } };
        },
        after: async (user, planId) => {
          //function to create stripe account

          const customer = await stripeClient.customers.create({
            name: user.name,
            email: user.email,
          });
          return { customer, planId };
        },
      },
    },
  },
});

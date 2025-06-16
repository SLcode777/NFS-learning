import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins/magic-link";
import { default as Stripe } from "stripe";
import { prisma } from "./prisma";
import { resend } from "./resend";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      plan: {
        type: "string",
        required: false,
      },
    },
  },

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
        after: async (user) => {
          //function to create stripe account and then, update user in our database

          const customer = await stripeClient.customers.create({
            name: user.name,
            email: user.email,
          });

          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              stripeCustomerId: customer.id,
            },
          });
        },
      },
      update: {
        after: async (user) => {
          //
          console.log("looking for customer on stripe... ");

          const { stripeCustomerId } = await prisma.user.findUniqueOrThrow({
            where: {
              id: user.id,
            },
            select: {
              stripeCustomerId: true,
            },
          });

          if (!stripeCustomerId) {
            console.log(
              "no customer with this id was found on stripe database ! "
            );
          } else {
            console.log("customer Id found : ", stripeCustomerId);
            console.log("updating customer on stripe, please wait ... ");

            await stripeClient.customers.update(stripeCustomerId, {
              email: user.email,
              name: user.name,
            });
            console.log("customer has been updated, congratulations !");
          }
        },
      },
    },
  },
});

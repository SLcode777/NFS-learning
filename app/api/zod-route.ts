import { getUser } from "@/lib/auth-session";
import { createZodRoute } from "next-zod-route";
import { NextResponse } from "next/server";

export const route = createZodRoute();

export const authRoute = route.use(
  async ({ next, context, request, metadata }) => {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    return next({ context: { user } });
  }
);

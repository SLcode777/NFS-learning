import { createSafeActionClient } from "next-safe-action";
import { getUser } from "./auth-session";

// Base action client with error handling
export const actionClient = createSafeActionClient({
  handleServerError(error) {
    console.error("Action error:", error);
    return "An unexpected error occurred";
  },
});

// Extended action client with user authentication
export const userAction = actionClient.use(async ({ next }) => {
  const user = await getUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return next({
    ctx: { user },
  });
});

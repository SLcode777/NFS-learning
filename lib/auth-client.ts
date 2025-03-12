import { createAuthClient } from "better-auth/client";
import {
  inferAdditionalFields,
  magicLinkClient,
} from "better-auth/client/plugins";
import type { auth } from "./auth.ts";

export const authClient = createAuthClient({
  // TODO : Change this to the production URL
  baseURL: "http://localhost:3000",
  plugins: [magicLinkClient(), inferAdditionalFields<typeof auth>()],
});

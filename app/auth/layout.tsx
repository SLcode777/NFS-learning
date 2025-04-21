import { AppLayout } from "@/components/app-layout";
import type { ReactNode } from "react";

export default async function RouteLayout(props: { children: ReactNode }) {
  return <AppLayout>{props.children}</AppLayout>;
}

import { getRequiredUser } from "@/lib/auth-session";
import { PropsWithChildren } from "react";

export default async function Layout(props: PropsWithChildren) {
  await getRequiredUser();
  return (
    <div>
      <p>layout.tsx</p>
      {props.children}
    </div>
  );
}

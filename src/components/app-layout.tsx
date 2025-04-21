import { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import { Header } from "./header";

export const AppLayout = (props: PropsWithChildren) => {
  return (
    <div className="w-full border-x border-muted h-full flex flex-col gap-4 mx-auto min-h-full max-w-2xl">
      <Header />
      <div className="flex-1 px-4">{props.children}</div>
      <Toaster />
    </div>
  );
};

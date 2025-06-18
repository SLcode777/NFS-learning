import { getUser } from "@/lib/auth-session";
import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "./logout";
import { Button, buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

//tried to implement the billing management portal using stripe documentation
//total failure
//https://docs.stripe.com/customer-management/integrate-customer-portal#redirect
//go for the no-code version instead :
//https://docs.stripe.com/customer-management/activate-no-code-customer-portal

export const Header = async () => {
  const user = await getUser();

  return (
    <header className="px-4 py-2 border-b flex items-center gap-2">
      <Link
        href="/"
        className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text hover:opacity-80 transition-opacity"
      >
        NextDrop.io
      </Link>
      <Link
        href="/files"
        className="text-sm min-w-fit text-indigo-500 underline hover:text-indigo-600"
      >
        Upload files
      </Link>
      {user?.plan === "FREE" ? (
        <Link
          href="/pricing"
          className="text-sm min-w-fit text-indigo-500 underline hover:text-indigo-600"
        >
          Upgrade to PRO
        </Link>
      ) : null}
      <div className="flex flex-row w-full justify-end">
        {user?.plan === "IRON" ? (
          <Image
            src="/public/plan/PLAN_IRON.png"
            alt="user-plan-icon"
            height={30}
            width={30}
          ></Image>
        ) : null}
        {user?.plan === "GOLD" ? (
          <Image
            src="/plan/PLAN_GOLD.png"
            alt="user-plan-icon"
            height={30}
            width={30}
          ></Image>
        ) : null}
      </div>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button size="sm">{user.name || user.email}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href="/auth">Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={process.env.STIPE_CLIENT_PORTAL_LINK!}>Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          className={buttonVariants({ size: "sm", variant: "outline" })}
          href="/auth/signin"
        >
          SignIn
        </Link>
      )}
    </header>
  );
};

import { getUser } from "@/lib/auth-session";
import { PricingTable } from "./pricing-table";
import { PRICES } from "./pricing.data";

export default async function RoutePage() {
  const user = await getUser();

  return (
    <div className="container py-10 mx-auto">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Pricing Plans
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
          Choose the perfect plan for your needs. Upgrade or downgrade at any
          time.
        </p>
      </div>

      <div className="mt-10">
        <PricingTable currentPlan={user?.plan ?? "free"} prices={PRICES} />
      </div>
    </div>
  );
}

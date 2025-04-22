"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { upgradePlan } from "./price.action";

type PriceType = {
  id: string;
  name: string;
  price: number;
  features: string[];
  monthlyPriceId: string;
  yearlyPriceId: string;
};

const prices: PriceType[] = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    features: ["Basic file sharing", "Limited storage", "Standard support"],
    monthlyPriceId: "",
    yearlyPriceId: "",
  },
  {
    id: "IRON",
    name: "Iron",
    price: 5,
    features: ["Password protection", "Extended storage", "Priority support"],
    monthlyPriceId: "price_iron_monthly", // Replace with actual Stripe price ID
    yearlyPriceId: "price_iron_yearly", // Replace with actual Stripe price ID
  },
  {
    id: "GOLD",
    name: "Gold",
    price: 50,
    features: [
      "Unlimited sharing",
      "Premium storage",
      "24/7 support",
      "Custom branding",
    ],
    monthlyPriceId: "price_gold_monthly", // Replace with actual Stripe price ID
    yearlyPriceId: "price_gold_yearly", // Replace with actual Stripe price ID
  },
];

export function PricingTable(props: { currentPlan: string }) {
  const [isYearly, setIsYearly] = useState(false);
  const router = useRouter();

  const upgradeMutation = useMutation({
    mutationFn: async (priceId: string) => {
      const result = await upgradePlan({ priceId });

      if (!result?.data) {
        throw new Error(result?.serverError ?? "Something went wrong");
      }

      return result.data;
    },
    onSuccess: (data) => {
      router.push(data.url);
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-center">
        <div className="inline-flex items-center p-1 bg-secondary rounded-lg">
          <button
            onClick={() => setIsYearly(false)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all",
              !isYearly
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all",
              isYearly
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            Yearly (Save 20%)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {prices.map((price) => (
          <Card
            key={price.id}
            className={cn(
              "flex flex-col overflow-hidden transition-all hover:shadow-md",
              price.id === "gold" && "border-primary/50 shadow-sm p-0"
            )}
          >
            {price.id === "gold" && (
              <div className="py-1.5 text-xs font-medium text-center text-primary-foreground bg-primary">
                Most Popular
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">
                  {price.name}
                </CardTitle>
                {price.id === "free" ? (
                  <Badge variant="secondary">Free</Badge>
                ) : null}
              </div>
              <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                ${isYearly ? Math.floor(price.price * 12 * 0.8) : price.price}
                <span className="ml-1 text-lg font-medium text-muted-foreground">
                  {price.price > 0 ? `/${isYearly ? "year" : "month"}` : ""}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {price.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-4 h-4 mr-3 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-4 pb-8">
              <Button
                className={cn(
                  "w-full",
                  price.id === "gold" ? "bg-primary hover:bg-primary/90" : ""
                )}
                variant={price.id === props.currentPlan ? "outline" : "default"}
                disabled={
                  price.id === props.currentPlan || upgradeMutation.isPending
                }
                onClick={() => {
                  if (price.id === props.currentPlan) return;

                  upgradeMutation.mutate(
                    isYearly ? price.yearlyPriceId : price.monthlyPriceId
                  );
                }}
              >
                {price.id === props.currentPlan ? "Current Plan" : "Upgrade"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

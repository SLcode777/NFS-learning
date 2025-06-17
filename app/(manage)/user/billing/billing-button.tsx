"use client";

export const BillingButton = () => {
  const handleClick = async () => {
    const res = await fetch("/api/stripe-portal", { method: "POST" });
    const data = await res.json();
    window.location.href = data.url;
  };
  return <button onClick={handleClick}>Billing</button>;
};

import type { Cents } from "./money.js";

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: Cents;
  maxInvoicesPerMonth: number;
}

export const PLANS: readonly Plan[] = [
  { id: "starter", name: "Starter", monthlyPrice: 19900, maxInvoicesPerMonth: 50 },
  { id: "growth", name: "Growth", monthlyPrice: 49900, maxInvoicesPerMonth: 500 },
  { id: "scale", name: "Scale", monthlyPrice: 129900, maxInvoicesPerMonth: 5000 },
];

export function findPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

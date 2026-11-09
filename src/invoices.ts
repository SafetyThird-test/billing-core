import { randomUUID } from "node:crypto";
import { vatOn, type Cents } from "./money.js";
import { findPlan } from "./plans.js";
import type { Store } from "./store.js";

export interface Invoice {
  id: string;
  customerId: string;
  subscriptionId: string;
  billingDate: string; // YYYY-MM-DD
  subtotal: Cents;
  vat: Cents;
  total: Cents;
}

/**
 * Generates one invoice per active subscription for the given billing date.
 * Subscriptions that started mid-month are pro-rated on their first invoice.
 */
export function runInvoices(store: Store, billingDate: Date): Invoice[] {
  return store.activeSubscriptions(billingDate).map((sub) => {
    const plan = findPlan(sub.planId);
    if (!plan) throw new Error(`Subscription ${sub.id} has unknown plan ${sub.planId}`);

    const subtotal = prorate(plan.monthlyPrice, sub.startedOn, billingDate);
    const vat = vatOn(subtotal);
    return {
      id: randomUUID(),
      customerId: sub.customerId,
      subscriptionId: sub.id,
      billingDate: billingDate.toISOString().slice(0, 10),
      subtotal,
      vat,
      total: subtotal + vat,
    };
  });
}

export function prorate(monthly: Cents, startedOn: Date, billingDate: Date): Cents {
  const periodStart = new Date(billingDate);
  periodStart.setUTCMonth(periodStart.getUTCMonth() - 1);
  if (startedOn <= periodStart) return monthly;

  const dayMs = 24 * 60 * 60 * 1000;
  const periodDays = Math.round((billingDate.getTime() - periodStart.getTime()) / dayMs);
  const usedDays = Math.round((billingDate.getTime() - startedOn.getTime()) / dayMs);
  return Math.round((monthly * usedDays) / periodDays);
}

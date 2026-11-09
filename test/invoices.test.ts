import { describe, expect, it } from "vitest";
import fixtures from "./fixtures/customers.json" with { type: "json" };
import { prorate, runInvoices } from "../src/invoices.js";
import { Store } from "../src/store.js";

describe("prorate", () => {
  it("charges the full month when the subscription predates the period", () => {
    expect(prorate(19900, new Date("2026-01-01"), new Date("2026-03-01"))).toBe(19900);
  });

  it("charges half when the subscription started mid-period", () => {
    // 30-day period (Apr 1 -> May 1), started Apr 16 = 15 days
    expect(prorate(30000, new Date("2026-04-16"), new Date("2026-05-01"))).toBe(15000);
  });
});

describe("runInvoices", () => {
  it("creates one invoice per active subscription with 15% VAT", () => {
    const store = new Store();
    const [a, b] = fixtures.map((f) => store.addCustomer(f));
    store.subscribe(a.id, "starter", new Date("2026-01-01"));
    store.subscribe(b.id, "growth", new Date("2026-01-01"));

    const invoices = runInvoices(store, new Date("2026-03-01"));

    expect(invoices).toHaveLength(2);
    const starter = invoices.find((i) => i.customerId === a.id)!;
    expect(starter.subtotal).toBe(19900);
    expect(starter.vat).toBe(2985);
    expect(starter.total).toBe(22885);
  });

  it("skips cancelled subscriptions", () => {
    const store = new Store();
    const c = store.addCustomer(fixtures[2]);
    const sub = store.subscribe(c.id, "scale", new Date("2026-01-01"));
    sub.cancelledOn = new Date("2026-02-15");

    expect(runInvoices(store, new Date("2026-03-01"))).toHaveLength(0);
  });
});

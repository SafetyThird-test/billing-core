import express from "express";
import { z } from "zod";
import { runInvoices } from "./invoices.js";
import { PLANS, findPlan } from "./plans.js";
import { Store } from "./store.js";

const CustomerInput = z.object({
  businessName: z.string().min(1),
  contactEmail: z.string().email(),
});

const SubscribeInput = z.object({ planId: z.string() });
const RunInput = z.object({ billingDate: z.string().date() });

export function createApp(store = new Store()) {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.get("/plans", (_req, res) => res.json(PLANS));

  app.post("/customers", (req, res) => {
    const parsed = CustomerInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());
    res.status(201).json(store.addCustomer(parsed.data));
  });

  app.post("/customers/:id/subscriptions", (req, res) => {
    const parsed = SubscribeInput.safeParse(req.body);
    if (!parsed.success || !findPlan(parsed.data.planId)) {
      return res.status(400).json({ error: "Unknown plan" });
    }
    if (!store.customers.has(req.params.id)) return res.status(404).json({ error: "Unknown customer" });
    res.status(201).json(store.subscribe(req.params.id, parsed.data.planId, new Date()));
  });

  app.post("/invoices/run", (req, res) => {
    const parsed = RunInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());
    res.json(runInvoices(store, new Date(parsed.data.billingDate)));
  });

  return app;
}

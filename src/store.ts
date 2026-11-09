import { randomUUID } from "node:crypto";

export interface Customer {
  id: string;
  businessName: string;
  contactEmail: string;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  startedOn: Date;
  cancelledOn?: Date;
}

/** In-memory store. Production uses Postgres; this keeps the service self-contained for tests. */
export class Store {
  customers = new Map<string, Customer>();
  subscriptions = new Map<string, Subscription>();

  addCustomer(input: Omit<Customer, "id" | "createdAt">): Customer {
    const customer = { ...input, id: randomUUID(), createdAt: new Date() };
    this.customers.set(customer.id, customer);
    return customer;
  }

  subscribe(customerId: string, planId: string, startedOn: Date): Subscription {
    if (!this.customers.has(customerId)) throw new Error(`Unknown customer ${customerId}`);
    const sub = { id: randomUUID(), customerId, planId, startedOn };
    this.subscriptions.set(sub.id, sub);
    return sub;
  }

  activeSubscriptions(on: Date): Subscription[] {
    return [...this.subscriptions.values()].filter(
      (s) => s.startedOn <= on && (!s.cancelledOn || s.cancelledOn > on),
    );
  }
}

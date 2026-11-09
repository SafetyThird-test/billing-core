export const VAT_RATE = 0.15;

/** Amounts are integer cents to avoid floating point drift. */
export type Cents = number;

export function vatOn(amount: Cents): Cents {
  return Math.round(amount * VAT_RATE);
}

export function formatZar(amount: Cents): string {
  return `R ${(amount / 100).toFixed(2)}`;
}

export const DEFAULT_GST_PERCENT = 18;

export function computeQuotationTotals(
  items: Array<{ amount: number }>,
  gstPercent = DEFAULT_GST_PERCENT,
  discount = 0
) {
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );
  const gstAmount = (subtotal * gstPercent) / 100;
  const grandTotal = subtotal + gstAmount - discount;

  return {
    subtotal,
    gstAmount,
    discount,
    grandTotal,
  };
}

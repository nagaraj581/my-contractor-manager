import type { QuotationItem } from "../../models/QuotationItem";
import "./TotalsCard.css";

interface TotalsItem {
    amount: number;
}

interface Props {
    items: Array<QuotationItem | TotalsItem>;
    gst: number;
    discount: number;
}

export default function TotalsCard({
    items,
    gst,
    discount,
}: Props) {
    const subtotal = items.reduce(
        (sum, item) => sum + item.amount,
        0
    );

    const gstAmount = (subtotal * gst) / 100;
    const grandTotal = subtotal + gstAmount - discount;

    return (
        <div className="totals-card">
            <Row title="Subtotal" value={subtotal} />
            <Row title={`GST (${gst}%)`} value={gstAmount} />
            <Row title="Discount" value={discount} />
            <hr className="totals-divider" />
            <Row title="Grand Total" value={grandTotal} bold />
        </div>
    );
}

function Row({
    title,
    value,
    bold,
}: {
    title: string;
    value: number;
    bold?: boolean;
}) {
    return (
        <div className={`totals-row${bold ? " bold" : ""}`}>
            <span>{title}</span>
            <span>₹ {value.toFixed(2)}</span>
        </div>
    );
}

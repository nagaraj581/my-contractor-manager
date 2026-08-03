import type { QuotationItem } from "../../models/QuotationItem";
import "./QuotationItemsTable.css";

interface DraftItem {
    id?: string;
    description: string;
    quantity: number;
    unit: string;
    rate: number;
    amount: number;
}

interface Props {
    items: Array<QuotationItem | DraftItem>;
    onDelete: (id: string) => void;
    onEdit?: (item: QuotationItem | DraftItem) => void;
}

export default function QuotationItemsTable({
    items,
    onDelete,
    onEdit,
}: Props) {
    if (items.length === 0) {
        return (
            <div className="quotation-items-empty-inline">
                No quotation items added yet.
            </div>
        );
    }

    return (
        <div className="quotation-items-table-wrap">
            <table className="quotation-items-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th className="col-num">Qty</th>
                        <th>Unit</th>
                        <th className="col-num">Rate</th>
                        <th className="col-num">Amount</th>
                        <th className="col-actions">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => {
                        const key = item.id ?? `draft-${index}`;

                        return (
                            <tr key={key}>
                                <td className="col-desc">{item.description}</td>
                                <td className="col-num">{item.quantity}</td>
                                <td>{item.unit}</td>
                                <td className="col-num">₹ {item.rate.toFixed(2)}</td>
                                <td className="col-num">₹ {item.amount.toFixed(2)}</td>
                                <td className="col-actions">
                                    {onEdit && (
                                        <button
                                            className="item-action-btn"
                                            type="button"
                                            title="Edit"
                                            onClick={() => onEdit(item)}
                                        >
                                            onEdit?.(item)
                                        </button>
                                    )}
                                    <button
                                        className="item-action-btn danger"
                                        type="button"
                                        title="Delete"
                                        onClick={() => {
                                            const confirmed = window.confirm(
                                                `Remove "${item.description}" from this quotation?`
                                            );

                                            if (!confirmed) return;

                                            onDelete(item.id ?? String(index));
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

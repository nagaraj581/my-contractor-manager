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
    canDelete?: boolean;
    onDelete: (id: string) => void;
    onEdit?: (item: QuotationItem | DraftItem) => void;
}

export default function QuotationItemsTable({
    items,
    canDelete = true,
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
                        // Create a stable key/id for draft items that haven't been saved to Firebase yet
                        const key = item.id ?? `draft-${index}`;

                        return (
                            <tr key={key}>
                                <td className="col-desc">{item.description}</td>
                                <td className="col-num">{item.quantity}</td>
                                <td>{item.unit}</td>
                                <td className="col-num">₹ {item.rate.toFixed(2)}</td>
                                <td className="col-num">₹ {item.amount.toFixed(2)}</td>
                                <td className="col-actions">
                                    
                                    {/* Edit Button - Only renders if onEdit is passed */}
                                    {onEdit && (
                                        <button 
                                            type="button" 
                                            className="action-btn edit-btn"
                                            title="Edit Item"
                                            onClick={() => onEdit(item)}
                                        >
                                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                    )}

                                    {/* Delete Button - Includes confirmation popup */}
                                    {canDelete && (
                                        <button 
                                            type="button" 
                                            className="action-btn delete-btn"
                                            title="Delete Item"
                                            onClick={() => {
                                                const confirmDelete = window.confirm("Are you sure you want to delete this item?");
                                                if (confirmDelete) {
                                                    onDelete(key);
                                                }
                                            }}
                                        >
                                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}

                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
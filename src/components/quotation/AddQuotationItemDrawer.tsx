import { useMemo, useState } from "react";

import Drawer from "../drawer/Drawer";
import PrimaryButton from "../buttons/PrimaryButton";
import TextField from "../inputs/TextField";

import type { RateCard } from "../../models/RateCard";
import "./AddQuotationItemDrawer.css";

interface Props {
    open: boolean;
    onClose: () => void;
    rateCards: RateCard[];
    existingRateCardIds?: string[];
    onAdd: (item: {
        rateCardId: string;
        description: string;
        category: string;
        unit: string;
        quantity: number;
        rate: number;
        amount: number;
    }) => Promise<void> | void;
}

export default function AddQuotationItemDrawer({
    open,
    onClose,
    rateCards,
    existingRateCardIds = [],
    onAdd,
}: Props) {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<RateCard | null>(null);
    const [qty, setQty] = useState("1");
    const [saving, setSaving] = useState(false);

    const existingIds = useMemo(
        () => new Set(existingRateCardIds),
        [existingRateCardIds]
    );

    const filtered = useMemo(() => {
        if (!search.trim()) return rateCards;

        return rateCards.filter(item =>
            item.itemName.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, rateCards]);

    async function handleAdd() {
        if (!selected) return;

        const quantity = Number(qty);

        if (!Number.isFinite(quantity) || quantity <= 0) {
            alert("Please enter a valid quantity greater than 0.");
            return;
        }

        if (existingIds.has(selected.id)) {
            const addAnyway = window.confirm(
                `"${selected.itemName}" is already added to this quotation.\n\nDo you still want to add it again?`
            );

            if (!addAnyway) return;
        }

        try {
            setSaving(true);

            await onAdd({
                rateCardId: selected.id,
                description: selected.itemName,
                category: selected.category,
                unit: selected.unit,
                quantity,
                rate: selected.rate,
                amount: quantity * selected.rate,
            });

            setSelected(null);
            setQty("1");
            setSearch("");
            onClose();
        } finally {
            setSaving(false);
        }
    }

    function handleClose() {
        setSelected(null);
        setQty("1");
        setSearch("");
        onClose();
    }

    return (
        <Drawer open={open} title="Add Item" onClose={handleClose}>
            {!selected ? (
                <div className="add-item-drawer">
                    <TextField
                        label="Search Rate Card"
                        value={search}
                        onChange={setSearch}
                    />

                    <div className="rate-card-list">
                        {filtered.length === 0 ? (
                            <div className="rate-card-empty">
                                No rate card items found.
                            </div>
                        ) : (
                            filtered.map(item => {
                                const alreadyAdded = existingIds.has(item.id);

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`rate-card-option${alreadyAdded ? " already-added" : ""}`}
                                        onClick={() => setSelected(item)}
                                    >
                                        <div className="rate-card-option-top">
                                            <strong>{item.itemName}</strong>
                                            {alreadyAdded && (
                                                <span className="added-badge">
                                                    Added
                                                </span>
                                            )}
                                        </div>
                                        <span>{item.category}</span>
                                        <em>₹ {item.rate.toFixed(2)}</em>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            ) : (
                <div className="add-item-drawer selected">
                    <button
                        type="button"
                        className="back-link"
                        onClick={() => setSelected(null)}
                    >
                        ← Back to list
                    </button>

                    <div className="selected-item-card">
                        <h2>{selected.itemName}</h2>
                        <p>{selected.category}</p>
                        <div className="selected-meta">
                            <span>Unit: {selected.unit}</span>
                            <strong>₹ {selected.rate.toFixed(2)}</strong>
                        </div>
                        {existingIds.has(selected.id) && (
                            <p className="duplicate-warning">
                                This item is already in the quotation.
                            </p>
                        )}
                    </div>

                    <TextField
                        label="Quantity"
                        value={qty}
                        onChange={setQty}
                    />

                    <div className="amount-preview">
                        <span>Amount</span>
                        <strong>
                            ₹ {(Number(qty || 0) * selected.rate).toFixed(2)}
                        </strong>
                    </div>

                    <PrimaryButton
                        title="Add Item"
                        loading={saving}
                        onClick={handleAdd}
                        fullWidth
                    />
                </div>
            )}
        </Drawer>
    );
}

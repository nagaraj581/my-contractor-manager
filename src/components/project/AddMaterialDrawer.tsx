import { useEffect, useState } from "react";

import Drawer from "../drawer/Drawer";
import TextField from "../inputs/TextField";
import PrimaryButton from "../buttons/PrimaryButton";

import type { ProjectMaterial } from "../../models/ProjectMaterial";

interface Props {
    open: boolean;
    onClose: () => void;

    editingMaterial?: ProjectMaterial | null;

    onSave: (material: {
        description: string;
        category: string;
        quantity: number;
        unit: string;
        rate: number;
        supplier: string;
        purchaseDate: string;
        notes: string;
        amount: number;
    }) => Promise<void>;
}

export default function AddMaterialDrawer({
    open,
    onClose,
    editingMaterial,
    onSave,
}: Props) {
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [unit, setUnit] = useState("");
    const [rate, setRate] = useState("0");
    const [supplier, setSupplier] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editingMaterial) {
            setDescription(editingMaterial.description);
            setCategory(editingMaterial.category);
            setQuantity(editingMaterial.quantity.toString());
            setUnit(editingMaterial.unit);
            setRate(editingMaterial.rate.toString());
            setSupplier(editingMaterial.supplier);
            setPurchaseDate(editingMaterial.purchaseDate);
            setNotes(editingMaterial.notes);
        } else {
            setDescription("");
            setCategory("");
            setQuantity("1");
            setUnit("");
            setRate("0");
            setSupplier("");
            setPurchaseDate("");
            setNotes("");
        }
    }, [editingMaterial, open]);

    const amount =
        Number(quantity || 0) *
        Number(rate || 0);

    async function handleSave() {
        if (!description.trim()) {
            alert("Description is required.");
            return;
        }

        try {
            setSaving(true);

            await onSave({
                description,
                category,
                quantity: Number(quantity),
                unit,
                rate: Number(rate),
                supplier,
                purchaseDate,
                notes,
                amount,
            });

            onClose();
        } finally {
            setSaving(false);
        }
    }

    return (
        <Drawer
            open={open}
            title={
                editingMaterial
                    ? "Edit Material"
                    : "Add Material"
            }
            onClose={onClose}
        >
            <TextField
                label="Description"
                value={description}
                onChange={setDescription}
            />

            <TextField
                label="Category"
                value={category}
                onChange={setCategory}
            />

            <TextField
                label="Quantity"
                value={quantity}
                onChange={setQuantity}
            />

            <TextField
                label="Unit"
                value={unit}
                onChange={setUnit}
            />

            <TextField
                label="Rate"
                value={rate}
                onChange={setRate}
            />

            <TextField
                label="Supplier"
                value={supplier}
                onChange={setSupplier}
            />

            <div style={{ marginBottom: 18 }}>
                <label
                    style={{
                        display: "block",
                        marginBottom: 6,
                        fontWeight: 600,
                    }}
                >
                    Purchase Date
                </label>

                <input
                    type="date"
                    value={purchaseDate}
                    onChange={e =>
                        setPurchaseDate(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: 12,
                        borderRadius: 10,
                        border: "1px solid #ddd",
                    }}
                />
            </div>

            <TextField
                label="Notes"
                value={notes}
                onChange={setNotes}
            />

            <div
                style={{
                    margin: "20px 0",
                    fontWeight: 600,
                }}
            >
                Amount : Rs. {amount.toFixed(2)}
            </div>

            <PrimaryButton
                title={
                    editingMaterial
                        ? "Update Material"
                        : "Save Material"
                }
                loading={saving}
                onClick={handleSave}
                fullWidth
            />
        </Drawer>
    );
}
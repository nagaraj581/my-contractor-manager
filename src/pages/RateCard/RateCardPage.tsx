import { useEffect, useState } from "react";

import Drawer from "../../components/drawer/Drawer";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import TextField from "../../components/inputs/TextField";
import PageContainer from "../../components/page/PageContainer";
import PageHeader from "../../components/page/PageHeader";
import PageToolbar from "../../components/page/PageToolbar";
import SearchBox from "../../components/page/SearchBox";
import { useCompanies } from "../../contexts/CompaniesContext";
import {
  addRateCardItem,
  importRateCards,
  subscribeRateCards,
} from "../../services/rateCardService";
import { readRateCardExcel } from "../../services/rateCardImportService";
import type { ImportedRateCard } from "../../models/ImportedRateCard";
import type { RateCard } from "../../models/RateCard";

export default function RateCardPage() {
  const { currentCompany } = useCompanies();
  const [items, setItems] = useState<RateCard[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [unit, setUnit] = useState("");
  const [rate, setRate] = useState("");
  const [gst, setGst] = useState("");
  const [hsn, setHsn] = useState("");
  const [description, setDescription] = useState("");
  const [previewItems, setPreviewItems] = useState<ImportedRateCard[]>([]);

  useEffect(() => {
    if (!currentCompany) return;

    return subscribeRateCards(currentCompany.id, rateCards => {
      const sortedItems = [...rateCards].sort((firstItem, secondItem) =>
        firstItem.category.localeCompare(secondItem.category) ||
        firstItem.itemName.localeCompare(secondItem.itemName)
      );

      setItems(sortedItems);
    });
  }, [currentCompany]);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredItems = items.filter(item => {
    if (!normalizedSearch) return true;

    return (
      item.itemName.toLowerCase().includes(normalizedSearch) ||
      item.category.toLowerCase().includes(normalizedSearch)
    );
  });

  const groupedItems = filteredItems.reduce<Record<string, RateCard[]>>(
    (groups, item) => {
      const groupName = item.category || "Uncategorized";

      groups[groupName] = groups[groupName] || [];
      groups[groupName].push(item);

      return groups;
    },
    {}
  );

  async function handleImport() {
    if (!currentCompany) return;
    if (importing || previewItems.length === 0) return;

    try {
      setImporting(true);

      const importItems = previewItems.map(item => ({
        companyId: currentCompany.id,
        category: item.category,
        subCategory: item.subCategory,
        itemName: item.itemName,
        unit: item.unit,
        rate: item.rate,
        gst: item.gst,
        hsn: item.hsn,
        description: item.remarks,
        createdAt: new Date().toISOString(),
      }));

      await importRateCards(importItems);

      alert(`${previewItems.length} items imported successfully.`);

      setPreviewItems([]);

      const input = document.getElementById(
        "excel-file"
      ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }
    } catch (error) {
      console.error(error);
      alert("Import failed.");
    } finally {
      setImporting(false);
    }
  }

  async function handleSave() {
    if (!currentCompany) return;

    if (!category || !itemName || !rate) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      await addRateCardItem({
        companyId: currentCompany.id,
        category,
        subCategory,
        itemName,
        unit,
        rate: Number(rate),
        gst: Number(gst || 0),
        hsn,
        description,
        createdAt: new Date().toISOString(),
      });

      setOpen(false);
      setCategory("");
      setSubCategory("");
      setItemName("");
      setUnit("");
      setRate("");
      setGst("");
      setHsn("");
      setDescription("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        icon="💡"
        title="Rate Card"
        subtitle="Manage your company's standard rates"
        action={
          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <PrimaryButton
              title="📥 Import Excel"
              disabled={importing}
              onClick={() =>
                document
                  .getElementById("excel-file")
                  ?.click()
              }
            />

            <PrimaryButton
              title="+ Add Item"
              onClick={() => setOpen(true)}
            />
          </div>
        }
      />

      <input
        id="excel-file"
        type="file"
        accept=".xlsx,.xls"
        hidden
        onChange={async event => {
          const file = event.target.files?.[0];

          if (!file) return;

          try {
            const data = await readRateCardExcel(file);

            setPreviewItems(data);
          } catch (error) {
            console.error(error);
            alert("Invalid Excel file.");
          }
        }}
      />

      <PageContainer>
        {items.length === 0 ? (
          <p>No items yet.</p>
        ) : (
          <>
            <PageToolbar>
              <SearchBox
                value={search}
                onChange={setSearch}
              />
            </PageToolbar>

            {filteredItems.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#64748B",
                }}
              >
                <p>No rate card items match your search</p>
              </div>
            ) : (
              Object.entries(groupedItems).map(([groupName, groupItems]) => (
                <section
                  key={groupName}
                  style={{
                    marginBottom: 28,
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 12px",
                      color: "#0F4C81",
                      fontSize: 18,
                    }}
                  >
                    {groupName}
                  </h2>

                  <div
                    style={{
                      borderTop: "1px solid #E5E7EB",
                    }}
                  >
                    {groupItems.map(item => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 16,
                          padding: "16px 0",
                          borderBottom: "1px solid #E5E7EB",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              margin: "0 0 6px",
                              fontSize: 16,
                            }}
                          >
                            {item.itemName}
                          </h3>

                          <p
                            style={{
                              margin: 0,
                              color: "#64748B",
                            }}
                          >
                            {item.unit || item.subCategory || "Rate item"}
                          </p>
                        </div>

                        <strong
                          style={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          ₹ {item.rate}
                        </strong>
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}
          </>
        )}
      </PageContainer>

      {previewItems.length > 0 && (
        <PageContainer>
          <h2>Import Preview</h2>

          <p>{previewItems.length} items found.</p>

          <table className="import-table">
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    width: "22%",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Category
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    width: "48%",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Description
                </th>

                <th
                  style={{
                    textAlign: "center",
                    padding: "12px",
                    width: "15%",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Unit
                </th>

                <th
                  style={{
                    textAlign: "right",
                    padding: "12px",
                    width: "15%",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Rate
                </th>
              </tr>
            </thead>

            <tbody>
              {previewItems.map((item, index) => (
                <tr key={index}>
                  <td
                    style={{
                      padding: "10px 12px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {item.category}
                  </td>

                  <td
                    style={{
                      padding: "10px 12px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {item.itemName}
                  </td>

                  <td
                    style={{
                      textAlign: "center",
                      padding: "10px 12px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {item.unit}
                  </td>

                  <td
                    style={{
                      textAlign: "right",
                      padding: "10px 12px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    ₹ {item.rate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 20 }}>
            <PrimaryButton
              title={`Import ${previewItems.length} Items`}
              loading={importing}
              onClick={handleImport}
            />
          </div>
        </PageContainer>
      )}

      <Drawer
        open={open}
        title="Add Rate Item"
        onClose={() => setOpen(false)}
      >
        <TextField
          label="Category"
          value={category}
          onChange={setCategory}
          required
        />

        <TextField
          label="Sub Category"
          value={subCategory}
          onChange={setSubCategory}
        />

        <TextField
          label="Item Name"
          value={itemName}
          onChange={setItemName}
          required
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
          required
        />

        <TextField
          label="GST"
          value={gst}
          onChange={setGst}
        />

        <TextField
          label="HSN"
          value={hsn}
          onChange={setHsn}
        />

        <TextField
          label="Description"
          value={description}
          onChange={setDescription}
        />

        <div style={{ marginTop: 25 }}>
          <PrimaryButton
            title="Save Item"
            loading={saving}
            onClick={handleSave}
            fullWidth
          />
        </div>
      </Drawer>
    </>
  );
}

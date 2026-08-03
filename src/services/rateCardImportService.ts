import * as XLSX from "xlsx";

import type { ImportedRateCard } from "../models/ImportedRateCard";

export async function readRateCardExcel(
  file: File
): Promise<ImportedRateCard[]> {

  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer);

  const firstSheetName = workbook.SheetNames[0];

const sheet = workbook.Sheets[firstSheetName];

if (!sheet) {
    throw new Error("No worksheet found.");
}

  const rows =
    XLSX.utils.sheet_to_json<any>(sheet);

  return rows.map(row => ({

    category: String(row["Category"] ?? "").trim(),

    subCategory: String(row["Sub Category"] ?? "").trim(),

    itemName: String(row["Description"] ?? "").trim(),

    unit: String(row["Unit"] ?? "").trim(),

    rate: Number(row["Rate"] ?? 0),

    gst: Number(row["GST"] ?? 0),

    hsn: String(row["HSN"] ?? "").trim(),

    remarks: String(row["Remarks"] ?? "").trim(),

}));

}
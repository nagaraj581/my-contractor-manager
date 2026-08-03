import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { Company } from "../../models/Company";
import type { Customer } from "../../models/Customer";
import type { Quotation } from "../../models/Quotation";
import type { QuotationItem } from "../../models/QuotationItem";

import { pdfTheme, page } from "./pdfStyles";
import { numberToWords } from "../../utils/numberToWords";
interface Props {

    company: Company;

    quotation: Quotation;

    customer: Customer;

    items: QuotationItem[];

}

export async function generateQuotationPdf({

    company,

    quotation,

    customer,

    items,

}:Props){

    const doc = new jsPDF();

    //----------------------------------
    // Company
    //----------------------------------

    doc.setFontSize(22);

    doc.setTextColor(...pdfTheme.primary);

   console.log("Company:", company);

doc.text(
  String(company.companyName ?? ""),
  page.left,
  20
);

doc.text(
  String(company.address ?? ""),
  page.left,
  28
);

    //----------------------------------
    // Title
    //----------------------------------

    doc.setFontSize(18);

    doc.text(

        "QUOTATION",

        150,

        20

    );

    //----------------------------------
    // Header
    //----------------------------------

    let y = 42;

    doc.setFontSize(11);

    doc.text(

        `Quotation No : ${quotation.quotationNo}`,

        page.left,

        y

    );

    y += 8;

    doc.text(

        `Date : ${quotation.quotationDate}`,

        page.left,

        y

    );

    y += 8;

    doc.text(

        `Customer : ${customer.name}`,

        page.left,

        y

    );

    y += 8;

    doc.text(

        `Site : ${quotation.siteAddress || "-"}`,

        page.left,

        y

    );

    //----------------------------------
    // Table
    //----------------------------------

    autoTable(doc,{

        startY:y+10,

        head:[[
            "Description",
            "Qty",
            "Unit",
            "Rate",
            "Amount",
        ]],

        body:items.map(item=>([
            item.description,
            item.quantity,
            item.unit,
            item.rate.toFixed(2),
            item.amount.toFixed(2),
        ])),

        headStyles:{

            fillColor:pdfTheme.primary,

        },

    });

    //----------------------------------
    // Totals
    //----------------------------------

    const subtotal =

        items.reduce(

            (sum,item)=>

                sum+item.amount,

            0

        );

    const gst =

        subtotal*0.18;

    const grand =

        subtotal+gst;

    let finalY =

        (doc as any).lastAutoTable.finalY+12;




    finalY += 8;

    doc.setFontSize(14);

    const pageWidth = doc.internal.pageSize.getWidth();

doc.text(
    `Grand Total : Rs. ${grand.toFixed(2)}`,
    pageWidth - 15,
    finalY,
    { align: "right" }
);

finalY += 16;

doc.setFontSize(11);

doc.text(
    "Amount in Words",
    page.left,
    finalY
);

finalY += 8;

doc.setFontSize(10);

doc.text(
    numberToWords(grand),
    page.left,
    finalY
);

    //----------------------------------
    // Footer
    //----------------------------------

    finalY += 28;

    doc.setFontSize(10);

    doc.text(

        "Thank you for your business.",

        page.left,

        finalY

    );

    doc.text(

        "Authorized Signature",

        145,

        finalY

    );

    //----------------------------------

    const blob = doc.output("blob");

const url = URL.createObjectURL(blob);

window.open(url, "_blank");

}
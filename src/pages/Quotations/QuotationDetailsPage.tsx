import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import PageHeader from "../../components/page/PageHeader";
import PageContainer from "../../components/page/PageContainer";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import AddQuotationItemDrawer from "../../components/quotation/AddQuotationItemDrawer";
import QuotationItemsTable from "../../components/quotation/QuotationItemsTable";
import QuotationSummaryCard
from "../../components/quotation/QuotationSummaryCard";
import TotalsCard from "../../components/quotation/TotalsCard";
import { useCompanies } from "../../contexts/CompaniesContext";
import { subscribeRateCards } from "../../services/rateCardService";
import type { Quotation } from "../../models/Quotation";
import {
    addQuotationItem,
    deleteQuotationItem,
    subscribeQuotationItems, } from "../../services/quotationItemService";
import type { RateCard } from "../../models/RateCard";
import {
    updateQuotation,
    subscribeQuotation,
} from "../../services/quotationService";
import type { QuotationItem } from "../../models/QuotationItem";
import {
    DEFAULT_GST_PERCENT,
    computeQuotationTotals,
} from "../../utils/quotationTotals";
import "./QuotationDetailsPage.css";
import { getCustomerById }
from "../../services/customerService";

import type { Customer }
from "../../models/Customer";
import { generateQuotationPdf }
from "../../services/pdf/quotationPdfService";
import {
convertQuotationToProject,} from "../../services/projectService";
import {
    updateQuotationItem,
} from "../../services/quotationItemService";

export default function QuotationDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentCompany } = useCompanies();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] =
    useState<QuotationItem | null>(null);
    const [rateCards, setRateCards] = useState<RateCard[]>([]);
    const [items, setItems] = useState<QuotationItem[]>([]);
    const [quotation, setQuotation] =
    useState<Quotation | null>(null);
    const [customer, setCustomer] =
useState<Customer | null>(null);

    
    
    


    useEffect(() => {
        if (!currentCompany) return;
        return subscribeRateCards(currentCompany.id, setRateCards);
    }, [currentCompany]);

    useEffect(() => {
        if (!id) return;
        return subscribeQuotationItems(id, setItems);
    }, [id]);

    useEffect(() => {

    if (!id) return;

    return subscribeQuotation(

        id,

        setQuotation

    );

}, [id]);
useEffect(() => {

    if (!quotation?.customerId) return;

    getCustomerById(
        quotation.customerId
    ).then(setCustomer);

}, [quotation]);

    async function syncTotals(
        nextItems: Array<{ amount: number }>
    ) {
        if (!id) return;

        await updateQuotation(
            id,
            computeQuotationTotals(nextItems, DEFAULT_GST_PERCENT, 0)
        );
    }

    async function handleConvertToProject() {

        if (quotation?.convertedToProject) {

            alert("This quotation has already been converted to a project.");
        
            return;
        
        }
        if (!quotation) return;

    try {

        await convertQuotationToProject({

    id: quotation.id,

    companyId: quotation.companyId,

    quotationNo: quotation.quotationNo,

    customerId: quotation.customerId,

    customerName: customer?.name || "",

    siteAddress: quotation.siteAddress,

    grandTotal: quotation.grandTotal,

});

alert("Project created successfully.");

navigate("/projects");

    }

    catch(error){

        console.error(error);

        alert("Unable to convert quotation.");

    }

}

    async function handleGeneratePdf() {

    if (!currentCompany) {

        alert("Company not loaded.");

        return;

    }

    if (!quotation) {

        alert("Quotation not loaded.");

        return;

    }

    if (!customer) {

        alert("Customer not loaded.");

        return;

    }

    if (items.length === 0) {

        alert("Add at least one item.");

        return;

    }

    await generateQuotationPdf({

        company: currentCompany,

        quotation,

        customer,

        items,

    });

}

    return (
        <>
            <PageHeader
                icon="📄"
                title="Quotation"
                subtitle="Review and edit line items"
                
                action={
                    <div
                        style={{
                            display: "flex",
                            gap: 10,
                        }}
                    >
                        <PrimaryButton
                            title="👁 Preview"
                            onClick={handleGeneratePdf}
                        />
                
                        {!quotation?.convertedToProject ? (
                            <>
                                <PrimaryButton
                                    title="+ Add Item"
                                    onClick={() => setDrawerOpen(true)}
                                />
                
                                <PrimaryButton
                                    title="🚀 Convert to Project"
                                    onClick={handleConvertToProject}
                                />
                            </>
                        ) : (
                            <PrimaryButton
                                title="📂 Open Project"
                                onClick={() =>
                                    navigate(`/projects/${quotation.projectId}`)
                                }
                            />
                        )}
                    </div>
                }
            />

            <PageContainer>
                <div className="quotation-details-section">
                    <QuotationSummaryCard
                        quotationNo={
    quotation?.quotationNo ?? "-"
}

customerName={
    customer?.name ?? "-"
}

quotationDate={
    quotation?.quotationDate ?? "-"
}

status={
    quotation?.status ?? "-"
}

siteAddress={
    quotation?.siteAddress ?? "-"
}
                        grandTotal={
                            items.reduce(
                                (sum, item) => sum + item.amount,
                                0
                            ) * 1.18
                        }
                    />

                    <div className="quotation-details-heading">
                        <h2>Line Items</h2>
                        <p>Manage rate card items for this quotation.</p>
                    </div>

                    {items.length === 0 ? (
                        <div className="quotation-details-empty">
                            <div>＋</div>
                            <h3>No items yet</h3>
                            <p>
                                Add items from your rate card to complete this
                                quotation.
                            </p>
                            <PrimaryButton
                                title="+ Add Item"
                                onClick={() => setDrawerOpen(true)}
                            />
                        </div>
                    ) : (
                        <>
                            
                            <QuotationItemsTable
    canDelete={!quotation?.convertedToProject}
    items={items}

    onEdit={item => {

        setEditingItem(item as QuotationItem);

        setDrawerOpen(true);

    }}

    onDelete={async itemId => {

        if (!id) return;

        await deleteQuotationItem(id, itemId);

        const remaining = items.filter(
            item => item.id !== itemId
        );

        await syncTotals(remaining);

    }}
/>
                            
                            <TotalsCard
                                items={items}
                                gst={DEFAULT_GST_PERCENT}
                                discount={0}
                            />
                        </>
                    )}
                </div>
            </PageContainer>

            <AddQuotationItemDrawer
                open={
                    drawerOpen &&
                    !quotation?.convertedToProject
                }
                editingItem={editingItem}
                onClose={() => {

    setDrawerOpen(false);

    setEditingItem(null);

}}
                rateCards={rateCards}
                existingRateCardIds={items.map(item => item.rateCardId)}
                onAdd={async item => {

                    if (!id) return;
                
                    if (editingItem) {
                
                        await updateQuotationItem(
                
                            id,
                
                            editingItem.id,
                
                            item
                
                        );
                        
                
                        const updated = items.map(i =>
                
                            i.id === editingItem.id
                                ? {
                                    ...i,
                                    ...item,
                                }
                                : i
                
                        );
                
                        await syncTotals(updated);
                        setDrawerOpen(false);

setEditingItem(null);
                
                        setEditingItem(null);
                
                    } else {
                
                        await addQuotationItem(id,{
                
                            quotationId:id,
                
                            ...item,
                
                            createdAt:new Date().toISOString(),
                
                        });
                
                        await syncTotals([...items,item]);
                
                    }
                
                }}
            />
        </>
    );
}

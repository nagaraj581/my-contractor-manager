import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PrimaryButton from "../../components/buttons/PrimaryButton";
import PageContainer from "../../components/page/PageContainer";
import PageHeader from "../../components/page/PageHeader";
import AddQuotationItemDrawer from "../../components/quotation/AddQuotationItemDrawer";
import QuotationHeader from "../../components/quotation/QuotationHeader";
import QuotationItemsTable from "../../components/quotation/QuotationItemsTable";
import TotalsCard from "../../components/quotation/TotalsCard";
import { useCompanies } from "../../contexts/CompaniesContext";
import type { Customer } from "../../models/Customer";
import type { RateCard } from "../../models/RateCard";
import { peekNextQuotationNumber } from "../../services/counterService";
import { subscribeCustomers } from "../../services/customerService";
import { createQuotationWithItems } from "../../services/quotationService";
import { subscribeRateCards } from "../../services/rateCardService";
import {
  DEFAULT_GST_PERCENT,
  computeQuotationTotals,
} from "../../utils/quotationTotals";
import "./AddQuotationPage.css";

type DraftItem = {
  localId: string;
  rateCardId: string;
  description: string;
  category: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
};

const previewRequests = new Map<string, Promise<string>>();

export default function AddQuotationPage() {
  const navigate = useNavigate();
  const { currentCompany } = useCompanies();

  const [quotationNumber, setQuotationNumber] = useState<{
    companyId: string;
    value: string;
  } | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rateCards, setRateCards] = useState<RateCard[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [items, setItems] = useState<DraftItem[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [saving, setSaving] = useState(false);

  const [quotationDate, setQuotationDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [validityDays, setValidityDays] = useState("30");
  const [reference, setReference] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!currentCompany) return;

    let request = previewRequests.get(currentCompany.id);

    if (!request) {
      request = peekNextQuotationNumber(currentCompany);
      previewRequests.set(currentCompany.id, request);
    }

    let isActive = true;

    request
      .then(previewNo => {
        if (isActive) {
          setQuotationNumber({
            companyId: currentCompany.id,
            value: previewNo,
          });
        }
      })
      .catch(error => {
        previewRequests.delete(currentCompany.id);
        console.error(error);

        if (isActive) {
          alert("Unable to preview quotation number.");
        }
      });

    return () => {
      isActive = false;
    };
  }, [currentCompany]);

  useEffect(() => {
    if (!currentCompany) return;
    return subscribeCustomers(currentCompany.id, setCustomers);
  }, [currentCompany]);

  useEffect(() => {
    if (!currentCompany) return;
    return subscribeRateCards(currentCompany.id, setRateCards);
  }, [currentCompany]);

  const quotationNo =
    currentCompany && quotationNumber?.companyId === currentCompany.id
      ? quotationNumber.value
      : "";

  const totals = useMemo(
    () => computeQuotationTotals(items, DEFAULT_GST_PERCENT, 0),
    [items]
  );

  async function handleSaveDraft() {
    if (!currentCompany) return;

    if (!customerId) {
      alert("Please select a customer.");
      return;
    }

    try {
      setSaving(true);

      const { id: quotationId, quotationNo: assignedNo } =
        await createQuotationWithItems(
          currentCompany,
          {
            companyId: currentCompany.id,
            customerId,
            quotationDate,
            validityDays: Number(validityDays || 0),
            siteAddress,
            reference,
            notes,
            subtotal: totals.subtotal,
            gstAmount: totals.gstAmount,
            discount: totals.discount,
            grandTotal: totals.grandTotal,
            status: "Draft",
            createdAt: new Date().toISOString(),
          },
          items.map(item => ({
            rateCardId: item.rateCardId,
            description: item.description,
            category: item.category,
            unit: item.unit,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
          }))
        );

      previewRequests.delete(currentCompany.id);
      setQuotationNumber({
        companyId: currentCompany.id,
        value: assignedNo,
      });

      navigate(`/quotations/${quotationId}`);
    } catch (error) {
      console.error(error);
      alert("Unable to save quotation.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        icon="📄"
        title="New Quotation"
        subtitle="Create a professional estimate for your customer"
        action={
          <PrimaryButton
            title="Save Draft"
            loading={saving}
            onClick={handleSaveDraft}
          />
        }
      />

      <div className="add-quotation-layout">
        <PageContainer>
          <div className="quotation-section-heading">
            <h2>Quotation Header</h2>
            <p>Set the document details before adding line items.</p>
          </div>

          <div className="quotation-customer-field">
            <label htmlFor="quotation-customer">
              Customer
              <span>*</span>
            </label>

            <select
              id="quotation-customer"
              value={customerId}
              onChange={event => setCustomerId(event.target.value)}
            >
              <option value="">Select customer...</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>

            {customers.length === 0 && (
              <small>Add a customer first to save this quotation.</small>
            )}
          </div>

          <QuotationHeader
            quotationNo={quotationNo}
            quotationDate={quotationDate}
            setQuotationDate={setQuotationDate}
            validityDays={validityDays}
            setValidityDays={setValidityDays}
            reference={reference}
            setReference={setReference}
            siteAddress={siteAddress}
            setSiteAddress={setSiteAddress}
            notes={notes}
            setNotes={setNotes}
          />

          {quotationNo && (
            <small className="quotation-number-hint">
              Number preview — final number is assigned when you save.
            </small>
          )}
        </PageContainer>

        <PageContainer>
          <div className="quotation-items-header">
            <div className="quotation-section-heading">
              <h2>Line Items</h2>
              <p>Add rate card items to build the quotation estimate.</p>
            </div>

            <PrimaryButton
              title="+ Add Item"
              onClick={() => setDrawerOpen(true)}
            />
          </div>

          {items.length === 0 ? (
            <div className="quotation-items-empty">
              <div>＋</div>
              <h3>No items yet</h3>
              <p>
                Pull items from your rate card to build a clear, professional
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
                items={items.map(item => ({
                  id: item.localId,
                  description: item.description,
                  quantity: item.quantity,
                  unit: item.unit,
                  rate: item.rate,
                  amount: item.amount,
                }))}
                onDelete={localId =>
                  setItems(previous =>
                    previous.filter(item => item.localId !== localId)
                  )
                }
              />
              <TotalsCard
                items={items}
                gst={DEFAULT_GST_PERCENT}
                discount={0}
              />
            </>
          )}
        </PageContainer>
      </div>

      <AddQuotationItemDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        rateCards={rateCards}
        existingRateCardIds={items.map(item => item.rateCardId)}
        onAdd={item =>
          setItems(previous => [
            ...previous,
            {
              ...item,
              localId: crypto.randomUUID(),
            },
          ])
        }
      />
    </>
  );
}

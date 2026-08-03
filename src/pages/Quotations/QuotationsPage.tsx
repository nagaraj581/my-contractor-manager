import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PrimaryButton from "../../components/buttons/PrimaryButton";
import EmptyState from "../../components/empty/EmptyState";
import PageContainer from "../../components/page/PageContainer";
import PageHeader from "../../components/page/PageHeader";
import PageToolbar from "../../components/page/PageToolbar";
import SearchBox from "../../components/page/SearchBox";
import { useCompanies } from "../../contexts/CompaniesContext";
import type { Customer } from "../../models/Customer";
import type { Quotation } from "../../models/Quotation";
import { subscribeCustomers } from "../../services/customerService";
import { subscribeQuotations } from "../../services/quotationService";
import "./QuotationsPage.css";

const STATUS_OPTIONS = [
  "All",
  "Draft",
  "Sent",
  "Accepted",
  "Rejected",
] as const;

type StatusFilter = typeof STATUS_OPTIONS[number];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getSortTime(value: string) {
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}

export default function QuotationsPage() {
  const navigate = useNavigate();
  const { currentCompany } = useCompanies();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  useEffect(() => {
    if (!currentCompany) return;

    return subscribeQuotations(
      currentCompany.id,
      nextQuotations => {
        const sortedQuotations = [...nextQuotations].sort(
          (firstQuotation, secondQuotation) =>
            getSortTime(secondQuotation.createdAt) -
            getSortTime(firstQuotation.createdAt)
        );

        setQuotations(sortedQuotations);
      }
    );
  }, [currentCompany]);

  useEffect(() => {
    if (!currentCompany) return;

    return subscribeCustomers(
      currentCompany.id,
      setCustomers
    );
  }, [currentCompany]);

  const customerById = customers.reduce<Record<string, Customer>>(
    (lookup, customer) => {
      lookup[customer.id] = customer;
      return lookup;
    },
    {}
  );

  const normalizedSearch = search.trim().toLowerCase();

  const filteredQuotations = quotations.filter(quotation => {
    const customerName = customerById[quotation.customerId]?.name || "";
    const matchesStatus =
      statusFilter === "All" || quotation.status === statusFilter;
    const matchesSearch =
      !normalizedSearch ||
      quotation.quotationNo.toLowerCase().includes(normalizedSearch) ||
      quotation.status.toLowerCase().includes(normalizedSearch) ||
      customerName.toLowerCase().includes(normalizedSearch);

    return matchesStatus && matchesSearch;
  });

  const totalValue = quotations.reduce(
    (sum, quotation) => sum + quotation.grandTotal,
    0
  );

  const acceptedValue = quotations
    .filter(quotation => quotation.status === "Accepted")
    .reduce(
      (sum, quotation) => sum + quotation.grandTotal,
      0
    );

  return (
    <>
      <PageHeader
        icon="📄"
        title="Quotations"
        subtitle="Prepare, track, and convert customer estimates"
        action={
          <PrimaryButton
            title="+ New Quotation"
            onClick={() => navigate("/quotations/new")}
          />
        }
      />

      <div className="quotation-stats">
        <div className="quotation-stat">
          <span>Total Quotations</span>
          <strong>{quotations.length}</strong>
        </div>

        <div className="quotation-stat">
          <span>Pipeline Value</span>
          <strong>{formatCurrency(totalValue)}</strong>
        </div>

        <div className="quotation-stat">
          <span>Accepted Value</span>
          <strong>{formatCurrency(acceptedValue)}</strong>
        </div>
      </div>

      <PageContainer>
        {quotations.length === 0 ? (
          <EmptyState
            title="No quotations yet"
            description="Create your first quotation and start building a professional estimate."
            buttonText="+ New Quotation"
            onClick={() => navigate("/quotations/new")}
          />
        ) : (
          <>
            <PageToolbar>
              <SearchBox
                value={search}
                onChange={setSearch}
              />

              <div className="quotation-tabs">
                {STATUS_OPTIONS.map(status => (
                  <button
                    key={status}
                    className={
                      statusFilter === status ? "active" : ""
                    }
                    onClick={() => setStatusFilter(status)}
                    type="button"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </PageToolbar>

            {filteredQuotations.length === 0 ? (
              <div className="quotation-empty-search">
                No quotations match your filters.
              </div>
            ) : (
              <div className="quotation-list">
                {filteredQuotations.map(quotation => {
                  const customer = customerById[quotation.customerId];

                  return (
                    <button
                      key={quotation.id}
                      className="quotation-row"
                      onClick={() => navigate(`/quotations/${quotation.id}`)}
                      type="button"
                    >
                      <div>
                        <strong>{quotation.quotationNo}</strong>
                        <span>
                          {customer?.name || "Customer not selected"}
                        </span>
                      </div>

                      <div>
                        <span>Date</span>
                        <strong>{formatDate(quotation.quotationDate)}</strong>
                      </div>

                      <div>
                        <span>Status</span>
                        <strong className={`status ${quotation.status.toLowerCase()}`}>
                          {quotation.status}
                        </strong>
                      </div>

                      <div className="quotation-amount">
                        <span>Total</span>
                        <strong>{formatCurrency(quotation.grandTotal)}</strong>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </PageContainer>
    </>
  );
}

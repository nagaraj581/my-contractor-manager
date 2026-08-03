import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompanies } from "../../contexts/CompaniesContext";
import { subscribeCustomers } from "../../services/customerService";
import { subscribeQuotations } from "../../services/quotationService";
import { subscribeRateCards } from "../../services/rateCardService";
import type { Customer } from "../../models/Customer";
import type { Quotation } from "../../models/Quotation";
import type { RateCard } from "../../models/RateCard";
import "./DashboardPage.css";

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const { currentCompany } = useCompanies();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [rateCards, setRateCards] = useState<RateCard[]>([]);

    useEffect(() => {
        if (!currentCompany) return;
        return subscribeCustomers(currentCompany.id, setCustomers);
    }, [currentCompany]);

    useEffect(() => {
        if (!currentCompany) return;
        return subscribeQuotations(currentCompany.id, setQuotations);
    }, [currentCompany]);

    useEffect(() => {
        if (!currentCompany) return;
        return subscribeRateCards(currentCompany.id, setRateCards);
    }, [currentCompany]);

    if (!currentCompany) {
        return (
            <div className="dashboard-empty-state">
                <div className="dashboard-empty-card">
                    <h1>Welcome back</h1>
                    <p>
                        You are signed in and ready to go. Add your first
                        company profile to start managing projects.
                    </p>
                    <button
                        className="add-company-btn"
                        onClick={() => navigate("/company-setup")}
                    >
                        Add Company
                    </button>
                </div>
            </div>
        );
    }

    const pipelineValue = quotations.reduce(
        (sum, quotation) => sum + quotation.grandTotal,
        0
    );

    const draftCount = quotations.filter(
        quotation => quotation.status === "Draft"
    ).length;

    return (
        <div className="dashboard-page">
            <div className="dashboard-hero">
                <div>
                    <p className="dashboard-eyebrow">Dashboard</p>
                    <h1>{currentCompany.companyName}</h1>
                    <p className="dashboard-subtitle">
                        {currentCompany.businessType || "Contractor"} ·{" "}
                        {currentCompany.ownerName}
                    </p>
                </div>

                <button
                    className="dashboard-cta"
                    onClick={() => navigate("/quotations/new")}
                >
                    + New Quotation
                </button>
            </div>

            <div className="dashboard-grid">
                <button
                    className="dashboard-stat"
                    onClick={() => navigate("/customers")}
                    type="button"
                >
                    <span>Customers</span>
                    <strong>{customers.length}</strong>
                </button>

                <button
                    className="dashboard-stat"
                    onClick={() => navigate("/quotations")}
                    type="button"
                >
                    <span>Quotations</span>
                    <strong>{quotations.length}</strong>
                </button>

                <button
                    className="dashboard-stat"
                    onClick={() => navigate("/rate-card")}
                    type="button"
                >
                    <span>Rate Card Items</span>
                    <strong>{rateCards.length}</strong>
                </button>

                <div className="dashboard-stat accent">
                    <span>Pipeline Value</span>
                    <strong>{formatCurrency(pipelineValue)}</strong>
                </div>
            </div>

            <div className="dashboard-panels">
                <div className="dashboard-panel">
                    <h2>Quick actions</h2>
                    <div className="dashboard-actions">
                        <button onClick={() => navigate("/quotations/new")}>
                            Create quotation
                        </button>
                        <button onClick={() => navigate("/customers")}>
                            Manage customers
                        </button>
                        <button onClick={() => navigate("/rate-card")}>
                            Update rate card
                        </button>
                    </div>
                </div>

                <div className="dashboard-panel">
                    <h2>At a glance</h2>
                    <ul className="dashboard-glance">
                        <li>
                            <span>Draft quotations</span>
                            <strong>{draftCount}</strong>
                        </li>
                        <li>
                            <span>Active customers</span>
                            <strong>{customers.length}</strong>
                        </li>
                        <li>
                            <span>Phone</span>
                            <strong>{currentCompany.phone || "—"}</strong>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

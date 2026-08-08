import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../components/layout/MainLayout";

import LoginPage from "../pages/Auth/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import CompanySelectorPage from "../pages/CompanySelector/CompanySelectorPage";
import CompanySetupPage from "../pages/Company/CompanySetupPage";

import CustomersPage from "../pages/Customers/CustomersPage";
import QuotationsPage from "../pages/Quotations/QuotationsPage";
import ProjectsPage from "../pages/Projects/ProjectsPage";
import RateCardPage from "../pages/RateCard/RateCardPage";
import SettingsPage from "../pages/Settings/SettingsPage";
import QuotationDetailsPage from "../pages/Quotations/QuotationDetailsPage";
import AddQuotationPage from "../pages/Quotations/AddQuotationPage";
import ProjectDetailsPage
from "../pages/Projects/ProjectDetailsPage";
export default function AppRouter() {

  const { loading } = useAuth();

  if (loading) {
    return null;
  }

  return (

    <Routes>

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/company-selector"
        element={
          <ProtectedRoute>
            <CompanySelectorPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company-setup"
        element={
          <ProtectedRoute>
            <CompanySetupPage />
          </ProtectedRoute>
        }
      />

      {/* ALL APP PAGES SHARE THE SAME LAYOUT */}

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >

        <Route
          path="/"
          element={<DashboardPage />}
        />

        <Route
          path="/customers"
          element={<CustomersPage />}
        />

        <Route
          path="/quotations"
          element={<QuotationsPage />}
        />

        <Route
          path="/quotations/new"
          element={<AddQuotationPage />}
        />

        <Route
          path="/quotations/:id"
          element={<QuotationDetailsPage />}
        />

        <Route
          path="/projects"
          element={<ProjectsPage />}
        />

        <Route
          path="/projects/:id"
          element={<ProjectDetailsPage />}
        />

        <Route
          path="/rate-card"
          element={<RateCardPage />}
        />

        <Route
          path="/settings"
          element={<SettingsPage />}
        />
        

      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>

  );

}

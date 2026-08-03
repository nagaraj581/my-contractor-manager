import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { useCompanies } from "../contexts/CompaniesContext";

import LoadingScreen from "../components/common/LoadingScreen";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {

  const { user, loading } = useAuth();

  const {
    currentCompany,
    loading: companyLoading,
  } = useCompanies();

  if (loading || companyLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Don't force company selection while already on selector/setup pages
  const path = window.location.pathname;

  if (
    !currentCompany &&
    path !== "/company-selector" &&
    path !== "/company-setup"
  ) {
    return (
      <Navigate
        to="/company-selector"
        replace
      />
    );
  }

  return <>{children}</>;

}
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Company } from "../models/Company";

import { useAuth } from "./AuthContext";

import { getCompaniesByUser } from "../services/companyService";

interface CompaniesContextType {
  companies: Company[];
  currentCompany: Company | null;
  loading: boolean;

  setCurrentCompany: (company: Company) => void;

  reloadCompanies: () => Promise<void>;
}

const CompaniesContext =
  createContext<CompaniesContextType>(
    {} as CompaniesContextType
  );

export function CompaniesProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const { user } = useAuth();

  const [companies, setCompanies] = useState<Company[]>([]);

  const [currentCompany, setCurrentCompany] =
    useState<Company | null>(null);

  const [loading, setLoading] = useState(true);

  async function loadCompanies() {

    if (!user) {
      setCompanies([]);
      setCurrentCompany(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const list =
      await getCompaniesByUser(user.uid);

    setCompanies(list);

    const savedCompanyId =
        localStorage.getItem("currentCompanyId");

    if (savedCompanyId) {

        const found = list.find(
            c => c.id === savedCompanyId
        );

        if (found) {
            setCurrentCompany(found);
        } else if (list.length > 0) {
            setCurrentCompany(list[0]);
        }

    } else if (list.length > 0) {

        setCurrentCompany(list[0]);

    }

    setLoading(false);
  }

  useEffect(() => {
    loadCompanies();
  }, [user]);

  return (
    <CompaniesContext.Provider
      value={{
        companies,
        currentCompany,
        loading,
        setCurrentCompany,
        reloadCompanies: loadCompanies,
      }}
    >
      {children}
    </CompaniesContext.Provider>
  );
}

export function useCompanies() {
  return useContext(CompaniesContext);
}

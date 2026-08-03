import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Company } from "../models/Company";
import { getCompaniesByUser } from "../services/companyService";
import { useAuth } from "./AuthContext";

interface CompanyContextType {
  companies: Company[];
  currentCompany: Company | null;
  loading: boolean;
  setCurrentCompany: (company: Company | null) => void;
}

const CompanyContext = createContext<CompanyContextType>({
  companies: [],
  currentCompany: null,
  loading: true,
  setCurrentCompany: () => {},
});

export function CompanyProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const { user } = useAuth();

  const [companies, setCompanies] =
    useState<Company[]>([]);

  const [currentCompany, setCurrentCompany] =
    useState<Company | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadCompanies() {

      if (!user) {

        setCompanies([]);
        setCurrentCompany(null);
        setLoading(false);
        return;

      }

      const allCompanies = await getCompaniesByUser(user.uid);

      setCompanies(allCompanies);
      setCurrentCompany(allCompanies[0] ?? null);

      setLoading(false);

    }

    loadCompanies();

  }, [user]);

  return (

    <CompanyContext.Provider
      value={{
        companies,
        currentCompany,
        loading,
        setCurrentCompany,
      }}
    >

      {children}

    </CompanyContext.Provider>

  );

}

export function useCompany() {

  return useContext(CompanyContext);

}

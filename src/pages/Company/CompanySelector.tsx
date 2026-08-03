import { useNavigate } from "react-router-dom";
import { useCompany } from "../../contexts/CompanyContext";
import type { Company } from "../../models/Company";
import "./CompanySelector.css";

export default function CompanySelector() {
  const navigate = useNavigate();
  const { companies, currentCompany, setCurrentCompany } = useCompany();

  const handleSelectCompany = (company: Company) => {
    setCurrentCompany(company);
    navigate("/", { replace: true });
  };

  const handleAddCompany = () => {
    navigate("/company-setup");
  };

  return (
    <div className="company-selector-container">
      <div className="company-selector-card">
        <h1>Select Your Company</h1>
        <p>Choose which company you'd like to work with</p>

        <div className="companies-list">
          {companies.map((company) => (
            <button
              key={company.id}
              className={`company-option ${
                currentCompany?.id === company.id ? "active" : ""
              }`}
              onClick={() => handleSelectCompany(company)}
            >
              <div className="company-option-content">
                <div className="company-option-icon">🏗️</div>
                <div className="company-option-text">
                  <h3>{company.companyName}</h3>
                  <p>{company.ownerName}</p>
                </div>
              </div>
              {currentCompany?.id === company.id && (
                <div className="checkmark">✓</div>
              )}
            </button>
          ))}
        </div>

        <button className="add-company-option" onClick={handleAddCompany}>
          <span className="add-icon">➕</span>
          Add New Company
        </button>
      </div>
    </div>
  );
}

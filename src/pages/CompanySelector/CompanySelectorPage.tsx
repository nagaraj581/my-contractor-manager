import "./CompanySelectorPage.css";

import { useCompanies } from "../../contexts/CompaniesContext";
import { useNavigate } from "react-router-dom";

export default function CompanySelectorPage() {

  const {
    companies = [],
    loading,
    setCurrentCompany,
  } = useCompanies();

  const navigate = useNavigate();

  if (loading) {
    return <div className="selector-page">Loading...</div>;
  }

  function selectCompany(index: number) {

    const company = companies[index];

    setCurrentCompany(company);

    localStorage.setItem(
        "currentCompanyId",
        company.id
    );

    navigate("/");

  }

  return (

    <div className="selector-page">

      <div className="selector-card">

        <h1>Select Your Company</h1>

        <p>
          Choose which company you'd like to work with.
        </p>

        {companies.map((company, index) => (

          <div
            key={company.id}
            className="company-card"
            onClick={() => selectCompany(index)}
          >

            <div className="logo">

              🏗

            </div>

            <div className="company-info">

              <h3>{company.companyName}</h3>

              <span>{company.ownerName}</span>

            </div>

          </div>

        ))}

        <button
          className="add-company"
          onClick={() =>
            navigate("/company-setup")
          }
        >
          + Add New Company
        </button>

      </div>

    </div>

  );

}

import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useCompanies } from "../../contexts/CompaniesContext";
import { logout } from "../../services/authService";

export default function Header() {
  const navigate = useNavigate();
  const { currentCompany } = useCompanies();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="header">
      <h2>{currentCompany?.companyName || "Contractor Manager"}</h2>

      <div className="header-right">
        <span className="notification">🔔</span>

        <button
          className="logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          🚪 <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
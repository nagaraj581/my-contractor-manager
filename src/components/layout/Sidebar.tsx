import "./Sidebar.css";

import { NavLink } from "react-router-dom";

import { sidebarMenu } from "../../data/sidebarMenu";

import { useCompanies } from "../../contexts/CompaniesContext";

import { logout } from "../../services/authService";

export default function Sidebar() {

    const { currentCompany } = useCompanies();

    async function handleLogout() {

        await logout();

    }

    return (

        <aside className="sidebar">

            <div className="company-box">

                <div className="company-logo">

                    🏗️

                </div>

                <div>

                    <h3>

                        {currentCompany?.companyName || "No Company"}

                    </h3>

                    <small>

                        {currentCompany?.businessType}

                    </small>

                </div>

            </div>

            <nav>

                {sidebarMenu.map(item => (

                    <div key={item.title}>

                        {item.path && (

                            <NavLink
                                to={item.path}
                                className="menu-link"
                            >

                                {item.icon && <item.icon />}

                                <span>

                                    {item.title}

                                </span>

                            </NavLink>

                        )}

                        {item.children && (

                            <>

                                <div className="menu-group">

                                    {item.title}

                                </div>

                                {item.children.map(child => (

                                    <NavLink
                                        key={child.title}
                                        to={child.path!}
                                        className="menu-link child"
                                    >

                                        {child.icon && <child.icon />}

                                        <span>

                                            {child.title}

                                        </span>

                                    </NavLink>

                                ))}

                            </>

                        )}

                    </div>

                ))}

            </nav>

            <button
                className="logout-btn"
                onClick={handleLogout}
            >

                Logout

            </button>

        </aside>

    );

}
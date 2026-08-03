import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { hasCompany } from "../../services/companyService";

export default function StartupPage() {

    const { user } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {

        async function checkCompany() {

            if (!user) return;

            const exists = await hasCompany(user.uid);

            if (exists) {

                navigate("/dashboard", { replace: true });

            } else {

                navigate("/company-setup", { replace: true });

            }

        }

        checkCompany();

    }, [user]);

    return <h2>Loading...</h2>;

}

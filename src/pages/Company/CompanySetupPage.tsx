import { useState } from "react";

import FormCard from "../../components/forms/FormCard";
import FormGrid from "../../components/forms/FormGrid";
import TextField from "../../components/inputs/TextField";
import SelectField from "../../components/inputs/SelectField";
import PrimaryButton from "../../components/buttons/PrimaryButton";

import { useAuth } from "../../contexts/AuthContext";
import { useCompanies } from "../../contexts/CompaniesContext";
import { createCompany } from "../../services/companyService";
import { useNavigate } from "react-router-dom";

import "./CompanySetupPage.css";

export default function CompanySetupPage() {

    const { user } = useAuth();
    const { reloadCompanies } = useCompanies();

    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [phone, setPhone] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [email, setEmail] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [saving, setSaving] = useState(false);

    function generateCompanyCode(name: string) {

        const words = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (words.length === 1) {

            return words[0]
                .substring(0, 3)
                .toUpperCase();

        }

        return words
            .map(word => word[0])
            .join("")
            .toUpperCase();

    }

    const handleSave = async () => {

        if (!user) return;

        if (!companyName.trim()) {

            alert("Company Name is required.");

            return;

        }

        if (!ownerName.trim()) {

            alert("Owner Name is required.");

            return;

        }

        if (!phone.trim()) {

            alert("Phone Number is required.");

            return;

        }

        if (!businessType) {

            alert("Select Business Type.");

            return;

        }

        try {

            setSaving(true);

            await createCompany({

                memberIds: [user.uid],

                companyName,

                companyCode: generateCompanyCode(companyName),

                ownerName,

                businessType,

                phone,

                whatsapp,

                email,

                address: "",

                city,

                district,

                state,

                pincode,

                website: "",

                logoUrl: "",

                createdAt: new Date().toISOString(),

            });

            alert("Company created successfully.");

            await reloadCompanies();

            navigate("/company-selector", { replace: true });

        } catch (error) {

            console.error(error);

            alert("Unable to save company.");

        } finally {

            setSaving(false);

        }

    };

    return (

        <div className="company-page">

            <FormCard
                title="Company Information"
                subtitle="Create your business profile."
            >

                <FormGrid>

                    <TextField
                        label="Company Name"
                        value={companyName}
                        onChange={setCompanyName}
                        required
                    />

                    <TextField
                        label="Owner Name"
                        value={ownerName}
                        onChange={setOwnerName}
                        required
                    />

                    <TextField
                        label="Phone"
                        value={phone}
                        onChange={setPhone}
                        required
                    />

                    <TextField
                        label="WhatsApp"
                        value={whatsapp}
                        onChange={setWhatsapp}
                    />

                    <TextField
                        label="Email"
                        value={email}
                        onChange={setEmail}
                    />

                    <SelectField
                        label="Business Type"
                        value={businessType}
                        onChange={setBusinessType}
                        required
                        options={[
                            "Electrical Contractor",
                            "Plumbing Contractor",
                            "Civil Contractor",
                            "Interior Designer",
                            "Fabricator",
                            "Painter",
                            "Other",
                        ]}
                    />

                    <TextField
                        label="City"
                        value={city}
                        onChange={setCity}
                    />

                    <TextField
                        label="District"
                        value={district}
                        onChange={setDistrict}
                    />

                    <TextField
                        label="State"
                        value={state}
                        onChange={setState}
                    />

                    <TextField
                        label="Pincode"
                        value={pincode}
                        onChange={setPincode}
                    />

                </FormGrid>

                <div className="save-area">

                    <PrimaryButton
                        title="Save Company"
                        loading={saving}
                        onClick={handleSave}
                        fullWidth
                    />

                </div>

            </FormCard>

        </div>

    );

}

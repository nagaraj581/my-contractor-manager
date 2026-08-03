import { useEffect, useState } from "react";

import EmptyState from "../../components/empty/EmptyState";
import Drawer from "../../components/drawer/Drawer";
import TextField from "../../components/inputs/TextField";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import CustomerCard from "../../components/customers/CustomerCard";
import PageHeader from "../../components/page/PageHeader";
import PageContainer from "../../components/page/PageContainer";
import PageToolbar from "../../components/page/PageToolbar";
import SearchBox from "../../components/page/SearchBox";
import { useCompanies } from "../../contexts/CompaniesContext";
import { addCustomer, subscribeCustomers } from "../../services/customerService";
import type { Customer } from "../../models/Customer";

export default function CustomersPage() {

    const [open, setOpen] = useState(false);
    const { currentCompany } = useCompanies();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");

const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [whatsapp, setWhatsapp] = useState("");
const [email, setEmail] = useState("");
const [address, setAddress] = useState("");
const [city, setCity] = useState("");
const [district, setDistrict] = useState("");
const [state, setState] = useState("");
const [pincode, setPincode] = useState("");
const [remarks, setRemarks] = useState("");

const [saving, setSaving] = useState(false);

useEffect(() => {

    if (!currentCompany) return;

    const unsubscribe = subscribeCustomers(
        currentCompany.id,
        setCustomers
    );

    return unsubscribe;

}, [currentCompany]);

async function handleSave() {

    if (!currentCompany) return;

    if (!name.trim()) {

        alert("Customer name is required.");

        return;

    }

    if (!phone.trim()) {

        alert("Phone number is required.");

        return;

    }

    try {

        setSaving(true);

        await addCustomer({

            companyId: currentCompany.id,

            name,

            phone,

            whatsapp,

            email,

            address,

            city,

            district,

            state,

            pincode,

            remarks,

            createdAt: new Date().toISOString(),

        });

        alert("Customer saved successfully.");

        setOpen(false);

        setName("");
        setPhone("");
        setWhatsapp("");
        setEmail("");
        setAddress("");
        setCity("");
        setDistrict("");
        setState("");
        setPincode("");
        setRemarks("");

    } finally {

        setSaving(false);

    }

}

const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.phone.includes(search)
);

    return (

        <>

            <PageHeader
                icon="👥"
                title="Customers"
                subtitle="Manage all customers"
                action={
                    <PrimaryButton
                        title="+ Add Customer"
                        onClick={() => setOpen(true)}
                    />
                }
            />

            <PageContainer>

                {filteredCustomers.length === 0 && customers.length === 0 ? (

                    <EmptyState
                        title="No customers yet"
                        description="Create your first customer."
                        buttonText="+ Add Customer"
                        onClick={() => setOpen(true)}
                    />

                ) : (

                    <>

                        <PageToolbar>

                            <SearchBox
                                value={search}
                                onChange={setSearch}
                            />

                        </PageToolbar>

                        {filteredCustomers.length === 0 ? (

                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                                <p>No customers match your search</p>
                            </div>

                        ) : (

                            <div>

                                {filteredCustomers.map(customer => (

                                    <CustomerCard

                                        key={customer.id}

                                        customer={customer}

                                    />

                                ))}

                            </div>

                        )}

                    </>

                )}

            </PageContainer>

            <Drawer

                open={open}

                title="Add Customer"

                onClose={() => setOpen(false)}

            >

                <TextField
    label="Customer Name"
    value={name}
    onChange={setName}
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

<TextField
    label="Address"
    value={address}
    onChange={setAddress}
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

<TextField
    label="Remarks"
    value={remarks}
    onChange={setRemarks}
/>

<div
    style={{
        marginTop:30,
    }}
>

<PrimaryButton
    title="Save Customer"
    loading={saving}
    onClick={handleSave}
    fullWidth
/>

</div>

            </Drawer>

        </>

    );

}
import "./CustomerCard.css";

import type { Customer } from "../../models/Customer";

interface Props{
    customer:Customer;
}

export default function CustomerCard({
    customer,
}:Props){

    return(

        <div className="customer-card">

            <h3>

                {customer.name}

            </h3>

            <p>

                📞 {customer.phone}

            </p>

            <p>

                📍 {customer.city}

            </p>

        </div>

    );

}

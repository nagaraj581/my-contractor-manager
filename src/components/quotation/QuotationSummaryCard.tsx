import "./QuotationSummaryCard.css";

interface Props {

    quotationNo:string;

    customerName:string;

    quotationDate:string;

    status:string;

    siteAddress:string;

    grandTotal:number;

}

export default function QuotationSummaryCard({

    quotationNo,

    customerName,

    quotationDate,

    status,

    siteAddress,

    grandTotal,

}:Props){

    return(

        <div className="quotation-summary">

            <div className="summary-left">

                <h2>

                    📄 {quotationNo}

                </h2>

                <div className="summary-grid">

                    <div>

                        <span>Customer</span>

                        <strong>

                            {customerName}

                        </strong>

                    </div>

                    <div>

                        <span>Date</span>

                        <strong>

                            {quotationDate}

                        </strong>

                    </div>

                    <div>

                        <span>Site</span>

                        <strong>

                            {siteAddress || "-"}

                        </strong>

                    </div>

                    <div>

                        <span>Status</span>

                        <strong>

                            {status}

                        </strong>

                    </div>

                </div>

            </div>

            <div className="summary-right">

                <div className="amount-title">

                    Grand Total

                </div>

                <div className="amount">

                    ₹ {grandTotal.toFixed(2)}

                </div>

            </div>

        </div>

    );

}
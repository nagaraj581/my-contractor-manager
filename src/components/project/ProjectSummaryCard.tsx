import "./ProjectSummaryCard.css";

interface Props {

    projectName: string;

    customerName: string;

    quotationNo: string;

    status: string;

    startDate: string;

    estimatedAmount: number;

    progress: number;

}

export default function ProjectSummaryCard({

    projectName,

    customerName,

    quotationNo,

    status,

    startDate,

    estimatedAmount,

    progress,

}: Props) {

    return (

        <div className="project-summary-card">

            <h2>{projectName}</h2>

            <div className="project-summary-grid">

                <div>
                    <small>Customer</small>
                    <strong>{customerName}</strong>
                </div>

                <div>
                    <small>Quotation</small>
                    <strong>{quotationNo}</strong>
                </div>

                <div>
                    <small>Status</small>
                    <strong>{status}</strong>
                </div>

                <div>
                    <small>Start Date</small>
                    <strong>{startDate}</strong>
                </div>

            </div>

            <div className="project-summary-amount">

                Rs. {estimatedAmount.toFixed(2)}

            </div>

            <div className="project-progress">

                <div
                    className="project-progress-fill"
                    style={{
                        width: `${progress}%`,
                    }}
                />

            </div>

            <small>

                Progress {progress}%

            </small>

        </div>

    );

}
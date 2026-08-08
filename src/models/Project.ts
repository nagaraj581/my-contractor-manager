export interface Project {
    id: string;

    companyId: string;

    quotationId: string;

    quotationNo: string;

    customerId: string;

    customerName: string;

    projectName: string;

    siteAddress: string;

    startDate: string;

    expectedCompletionDate: string;

    status:
        | "Planning"
        | "In Progress"
        | "Completed"
        | "On Hold";

    progress: number;

    estimatedAmount: number;

    actualAmount: number;

    notes: string;

    createdAt: string;
}
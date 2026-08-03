import TextField from "../inputs/TextField";
import "./QuotationHeader.css";


interface Props {
  quotationNo: string;

  quotationDate: string;
  setQuotationDate: (value: string) => void;

  validityDays: string;
  setValidityDays: (value: string) => void;

  reference: string;
  setReference: (value: string) => void;

  siteAddress: string;
  setSiteAddress: (value: string) => void;

  notes: string;
  setNotes: (value: string) => void;
}


export default function QuotationHeader(props: Props) {
  return (
    <div className="quotation-header">
      <TextField
        label="Quotation No"
        value={props.quotationNo}
        disabled
        required
      />

      <TextField
        label="Quotation Date"
        value={props.quotationDate}
        onChange={props.setQuotationDate}
        type="date"
        required
      />

      <TextField
        label="Validity (Days)"
        value={props.validityDays}
        onChange={props.setValidityDays}
      />

      <TextField
        label="Reference"
        value={props.reference}
        onChange={props.setReference}
      />

      <TextField
        label="Site Address"
        value={props.siteAddress}
        onChange={props.setSiteAddress}
      />

      <TextField
        label="Notes"
        value={props.notes}
        onChange={props.setNotes}
      />
    </div>
  );
}

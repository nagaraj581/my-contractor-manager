import "./TextField.css";

interface TextFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  type?: string;
  onChange?: (value: string) => void;
}

export default function TextField({
  label,
  value = "",
  placeholder = "",
  required = false,
  disabled = false,
  error,
  type = "text",
  onChange,
}: TextFieldProps) {
  return (
    <div className="textfield">

      <label>

        {label}

        {required && <span>*</span>}

      </label>

      <input
    type={type}
    value={value}
    placeholder={placeholder}
    disabled={disabled}
    onChange={(e) => onChange?.(e.target.value)}
/>

      {error && (
        <small>{error}</small>
      )}

    </div>
  );
}
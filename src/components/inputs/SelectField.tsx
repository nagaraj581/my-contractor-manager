import "./TextField.css";

interface SelectFieldProps {
  label: string;
  value: string;
  required?: boolean;
  onChange?: (value: string) => void;
  options: string[];
}

export default function SelectField({
  label,
  value,
  required = false,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <div className="textfield">

      <label>
        {label}
        {required && <span>*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="">
          Select...
        </option>

        {options.map(option => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}

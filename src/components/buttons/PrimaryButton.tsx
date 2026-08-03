import "./PrimaryButton.css";

interface PrimaryButtonProps {
  title: string;
  onClick?: () => void;
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "danger";
  fullWidth?: boolean;
}

export default function PrimaryButton({
  title,
  onClick,
  type = "button",
  loading = false,
  disabled = false,
  variant = "primary",
  fullWidth = false,
}: PrimaryButtonProps) {
  return (
    <button
      className={`primary-btn ${variant}${fullWidth ? " full-width" : ""}`}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? "Please wait..." : title}
    </button>
  );
}

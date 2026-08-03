import "./FormCard.css";

interface FormCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function FormCard({
  title,
  subtitle,
  children,
}: FormCardProps) {
  return (
    <div className="form-card">

      <h1>{title}</h1>

      {subtitle && (
        <p>{subtitle}</p>
      )}

      {children}

    </div>
  );
}
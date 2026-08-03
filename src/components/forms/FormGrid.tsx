import "./FormGrid.css";

export default function FormGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="form-grid">
      {children}
    </div>
  );
}
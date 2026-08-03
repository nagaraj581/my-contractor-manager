import "./PageHeader.css";

interface PageHeaderProps {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({
  icon,
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <div className="page-header">

      <div>

        <h1>

          {icon && <span className="page-icon">{icon}</span>}

          {title}

        </h1>

        {subtitle && (

          <p>{subtitle}</p>

        )}

      </div>

      {action && (

        <div>

          {action}

        </div>

      )}

    </div>
  );
}

import "./Drawer.css";

interface DrawerProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Drawer({
  open,
  title,
  children,
  onClose,
}: DrawerProps) {

  if (!open) return null;

  return (

    <div className="drawer-overlay">

      <div className="drawer">

        <div className="drawer-header">

          <h2>{title}</h2>

          <button
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <div className="drawer-body">

          {children}

        </div>

      </div>

    </div>

  );

}
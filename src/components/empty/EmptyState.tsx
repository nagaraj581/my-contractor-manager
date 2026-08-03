import "./EmptyState.css";

interface EmptyStateProps {

    title: string;

    description: string;

    buttonText: string;

    onClick: () => void;

}

export default function EmptyState({

    title,

    description,

    buttonText,

    onClick,

}: EmptyStateProps) {

    return (

        <div className="empty-state">

            <div className="empty-icon">

                👥

            </div>

            <h2>

                {title}

            </h2>

            <p>

                {description}

            </p>

            <button
                onClick={onClick}
            >

                {buttonText}

            </button>

        </div>

    );

}
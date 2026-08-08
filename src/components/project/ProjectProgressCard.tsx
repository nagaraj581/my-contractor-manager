import "./ProjectProgressCard.css";

interface Props {
    progress: number;
}

export default function ProjectProgressCard({
    progress,
}: Props) {
    return (
        <div className="project-progress-card">

            <h3>Project Progress</h3>

            <div className="project-progress-bar">

                <div
                    className="project-progress-value"
                    style={{
                        width: `${progress}%`,
                    }}
                />

            </div>

            <div className="project-progress-text">

                {progress}% Completed

            </div>

        </div>
    );
}
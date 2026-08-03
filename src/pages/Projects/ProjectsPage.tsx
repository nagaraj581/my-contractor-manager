import PageHeader from "../../components/page/PageHeader";
import PageContainer from "../../components/page/PageContainer";
import "../../styles/coming-soon.css";

export default function ProjectsPage() {
    return (
        <>
            <PageHeader
                icon="🏗️"
                title="Projects"
                subtitle="Track jobs converted from accepted quotations"
            />

            <PageContainer>
                <div className="coming-soon">
                    <div className="coming-soon-badge">Coming soon</div>
                    <h2>Project workspace is next</h2>
                    <p>
                        Convert accepted quotations into live projects with
                        schedules, site notes, and progress tracking.
                    </p>
                </div>
            </PageContainer>
        </>
    );
}

import PageHeader from "../../components/page/PageHeader";
import PageContainer from "../../components/page/PageContainer";
import "../../styles/coming-soon.css";

export default function SettingsPage() {
    return (
        <>
            <PageHeader
                icon="⚙️"
                title="Settings"
                subtitle="Company preferences, tax defaults, and numbering"
            />

            <PageContainer>
                <div className="coming-soon">
                    <div className="coming-soon-badge">Coming soon</div>
                    <h2>Settings hub is on the way</h2>
                    <p>
                        Configure GST defaults, quotation prefixes, document
                        branding, and team preferences from one place.
                    </p>
                </div>
            </PageContainer>
        </>
    );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/page/PageHeader";
import PageContainer from "../../components/page/PageContainer";

import { useCompanies } from "../../contexts/CompaniesContext";

import {
    subscribeProjects,
} from "../../services/projectService";

import type { Project } from "../../models/Project";

import "./ProjectsPage.css";

export default function ProjectsPage() {

    const navigate = useNavigate();

    const { currentCompany } = useCompanies();

    const [projects, setProjects] =
        useState<Project[]>([]);

    useEffect(() => {

        if (!currentCompany) return;

        return subscribeProjects(
            currentCompany.id,
            setProjects
        );

    }, [currentCompany]);

    return (

        <>

            <PageHeader

                icon="🏗️"

                title="Projects"

                subtitle="Manage all active projects"

            />

            <PageContainer>

                {projects.length === 0 ? (

                    <div className="coming-soon">

                        <div className="coming-soon-badge">

                            No Projects

                        </div>

                        <h2>

                            Convert a quotation into a project

                        </h2>

                        <p>

                            Once a quotation is approved,

                            click "Convert to Project".

                        </p>

                    </div>

                ) : (

                    <div className="projects-grid">

                        {projects.map(project => (

                            <div

                                key={project.id}

                                className="project-card"

                                onClick={() =>
                                    navigate(
                                        `/projects/${project.id}`
                                    )
                                }

                            >

                                <h3>

                                    {project.projectName}

                                </h3>

                                <p>

                                    {project.customerName}

                                </p>

                                <small>

                                    {project.quotationNo}

                                </small>

                                <div
                                    style={{
                                        marginTop: 12,
                                    }}
                                >

                                    <strong>

                                        {project.status}

                                    </strong>

                                </div>

                                <div
                                    style={{
                                        marginTop: 10,
                                    }}
                                >

                                    Progress

                                    <br />

                                    {project.progress}%

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </PageContainer>

        </>

    );

}
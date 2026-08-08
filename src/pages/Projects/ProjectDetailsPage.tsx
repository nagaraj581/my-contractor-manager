import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageHeader from "../../components/page/PageHeader";
import PageContainer from "../../components/page/PageContainer";

import ProjectSummaryCard from "../../components/project/ProjectSummaryCard";
import ProjectProgressCard from "../../components/project/ProjectProgressCard";
import ProjectTasksCard from "../../components/project/ProjectTasksCard";

import type { Project } from "../../models/Project";
import ProjectStatsCard from "../../components/project/ProjectStatsCard";
import {
    subscribeProject,
    updateProject,
} from "../../services/projectService";
import type { ProjectTask } from "../../models/ProjectTask";

import {
    addProjectTask,
    deleteProjectTask,
    subscribeProjectTasks,
    updateProjectTask,
} from "../../services/projectTaskService";
import type { ProjectMaterial } from "../../models/ProjectMaterial";

import {
    subscribeProjectMaterials,
    updateProjectMaterial,
    addProjectMaterial,
} from "../../services/projectMaterialService";

import ProjectMaterialsCard from "../../components/project/ProjectMaterialsCard";
import AddMaterialDrawer from "../../components/project/AddMaterialDrawer";

import PrimaryButton from "../../components/buttons/PrimaryButton";
import {
    deleteProjectMaterial,
} from "../../services/projectMaterialService";

export default function ProjectDetailsPage() {
    const { id } = useParams();

    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<ProjectTask[]>([]);
    const [materials, setMaterials] = useState<ProjectMaterial[]>([]);

    const [materialDrawerOpen, setMaterialDrawerOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<ProjectMaterial | null>(null);

    useEffect(() => {
        if (!id) return;
        return subscribeProjectMaterials(id, setMaterials);
    }, [id]);

    useEffect(() => {
        if (!id) return;
        return subscribeProject(id, setProject);
    }, [id]);

    useEffect(() => {
        if (!id) return;
        return subscribeProjectTasks(id, setTasks);
    }, [id]);

    useEffect(() => {
        if (!project) return;
        if (tasks.length === 0) return;

        const completed = tasks.filter(task => task.completed).length;
        const progress = Math.round((completed / tasks.length) * 100);

        if (progress !== project.progress) {
            updateProject(project.id, { progress });
        }
    }, [tasks, project]);

    if (!project) {
        return (
            <PageContainer>
                Loading...
            </PageContainer>
        );
    }

    return (
        <>
            <PageHeader
                icon="🏗️"
                title="Project"
                subtitle="Manage project execution"
            />

            <PageContainer>
                <ProjectSummaryCard
                    projectName={project.projectName}
                    customerName={project.customerName}
                    quotationNo={project.quotationNo}
                    status={project.status}
                    startDate={project.startDate}
                    estimatedAmount={project.estimatedAmount}
                    progress={project.progress}
                />

                <div style={{ marginTop: 24 }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3,1fr)",
                            gap: 20,
                            marginTop: 24,
                        }}
                    >
                        <ProjectStatsCard
                            title="Status"
                            value={project.status}
                        />

                        <ProjectStatsCard
                            title="Progress"
                            value={`${project.progress}%`}
                        />

                        <ProjectStatsCard
                            title="Estimated Cost"
                            value={`Rs. ${project.estimatedAmount.toLocaleString("en-IN")}`}
                        />
                    </div>

                    <ProjectProgressCard progress={project.progress} />
                </div>

                <div style={{ marginTop: 24 }}>
                    <ProjectTasksCard
                        tasks={tasks}
                        onAdd={async (title) => {
                            if (!project) return;
                            await addProjectTask({
                                projectId: project.id,
                                title,
                                completed: false,
                                createdAt: new Date().toISOString(),
                            });
                        }}
                        onToggle={async (taskId, completed) => {
                            await updateProjectTask(taskId, { completed });
                        }}
                        onDelete={async (taskId) => {
                            await deleteProjectTask(taskId);
                        }}
                    />
                    
                    <ProjectMaterialsCard
    materials={materials}
    onEdit={item => {
        setEditingMaterial(item);
        setMaterialDrawerOpen(true);
    }}
    onDelete={async id => {
        if (!window.confirm("Delete this material?")) return;

        await deleteProjectMaterial(id);
    }}
/>

                    <div style={{ marginTop: 20, marginBottom: 20 }}>
                        <PrimaryButton
                            title="+ Add Material"
                            onClick={() => setMaterialDrawerOpen(true)}
                        />
                    </div>
                </div>
            </PageContainer>

            <AddMaterialDrawer
                open={materialDrawerOpen}
                editingMaterial={editingMaterial}
                onClose={() => {
                    setMaterialDrawerOpen(false);
                    setEditingMaterial(null);
                }}
                onSave={async (material) => {
                    if (!project) return;

                    if (editingMaterial) {
                        await updateProjectMaterial(editingMaterial.id, material);
                    } else {
                        await addProjectMaterial({
                            projectId: project.id,
                            ...material,
                            createdAt: new Date().toISOString(),
                        });
                    }

                    setMaterialDrawerOpen(false);
                    setEditingMaterial(null);
                }}
            />
        </>
    );
}
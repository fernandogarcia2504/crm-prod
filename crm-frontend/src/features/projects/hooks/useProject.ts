import { useEffect, useState } from "react";

import { getProject, updateTaskStatus as updateTaskStatusService } from "../services/projectService";

import type { Project, TaskStatus } from "../types/project.types";

export function useProject(companyId: string | null, projectId: string | null) {

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (!companyId || !projectId) {
            setProject(null);
            return;
        }

        const fetchProject = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getProject(companyId, projectId);

                setProject(data);

            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error ? error.message : "Error al obtener el proyecto"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchProject();

    }, [companyId, projectId]);

    const updateTaskStatus = async (phaseId: string, taskId: string, status: TaskStatus) => {

        if (!companyId || !projectId) {
            throw new Error("No existe un proyecto seleccionado");
        }

        // Actualizacion optimista: la tarea se mueve de inmediato en el
        // tablero y se confirma (o revierte) con la respuesta del backend.
        const previousProject = project;

        setProject((currentProject) => {

            if (!currentProject) return currentProject;

            return {
                ...currentProject,
                phases: currentProject.phases.map((phase) =>
                    phase._id === phaseId
                        ? {
                            ...phase,
                            checklist: phase.checklist.map((task) =>
                                task._id === taskId
                                    ? { ...task, status, completed: status === "Completado" }
                                    : task
                            )
                        }
                        : phase
                )
            };
        });

        try {

            const updatedProject = await updateTaskStatusService(
                companyId,
                projectId,
                phaseId,
                taskId,
                status
            );

            setProject(updatedProject);

            return updatedProject;

        } catch (error) {

            setProject(previousProject);

            throw error;

        }
    };

    return {
        project,
        loading,
        error,
        updateTaskStatus
    };

}
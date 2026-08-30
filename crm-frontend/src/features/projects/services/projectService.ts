import type { Project, TaskStatus, GetProjectsResponse, GetProjectResponse, UpdateTaskStatusResponse } from "../types/project.types";

const API_URL = "http://localhost:3000/api/projects";

export const getProjects = async (companyId: string): Promise<Project[]> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data: GetProjectsResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            "Error al obtener los proyectos de la empresa"
        );
    }

    return data.projects;
};

export const getProject = async (companyId: string, projectId: string): Promise<Project> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}/${projectId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data: GetProjectResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            "Error al obtener el proyecto"
        );
    }

    return data.project;
};

export const updateTaskStatus = async (
    companyId: string,
    projectId: string,
    phaseId: string,
    taskId: string,
    status: TaskStatus
): Promise<Project> => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/${companyId}/${projectId}/phases/${phaseId}/checklist/${taskId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        }
    );

    const data: UpdateTaskStatusResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al actualizar la tarea"
        );
    }

    return data.project;
};

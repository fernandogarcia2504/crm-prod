import { useEffect, useState } from "react";

import { getProjects } from "../services/projectService";

import type { Project } from "../types/project.types";

export function useProjects(companyId: string | null) {

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!companyId) {
            setProjects([]);
            return;
        }

        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getProjects(companyId);

                setProjects(data);

            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error ? error.message : "Error al obtener los proyectos de la empresa"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchProjects();
    }, [companyId]);

    return {
        projects,
        loading,
        error
    };

}

import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ChevronLeft, Fish } from "lucide-react";

import { BusinessContext } from "../../../app/context/BusinessContext";

import { useProject } from "../hooks/useProject";

import type { ProjectPhase, TaskStatus } from "../types/project.types";

const COLUMNS: { status: TaskStatus; label: string }[] = [
    { status: "Pendiente", label: "Por hacer" },
    { status: "En progreso", label: "En progreso" },
    { status: "Completado", label: "Completado" }
];

const getPhaseProgress = (phase: ProjectPhase) => {

    if (!phase.checklist.length) return 0;

    const completed = phase.checklist.filter(
        (task) => task.status === "Completado"
    ).length;

    return Math.round((completed / phase.checklist.length) * 100);
};

export default function ProjectPage() {

    const navigate = useNavigate();
    const { companyId, projectId } = useParams();

    const businessContext = useContext(BusinessContext);

    const { project, loading, error, updateTaskStatus } = useProject(
        companyId ?? null,
        projectId ?? null
    );

    const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null);

    const handleDragStart = (
        event: React.DragEvent<HTMLDivElement>,
        phaseId: string,
        taskId: string
    ) => {
        event.dataTransfer.setData(
            "application/json",
            JSON.stringify({ phaseId, taskId })
        );
    };

    const handleDrop = (
        event: React.DragEvent<HTMLDivElement>,
        status: TaskStatus
    ) => {
        event.preventDefault();
        setDraggedOverColumn(null);

        const raw = event.dataTransfer.getData("application/json");

        if (!raw) return;

        const { phaseId, taskId } = JSON.parse(raw) as {
            phaseId: string;
            taskId: string;
        };

        updateTaskStatus(phaseId, taskId, status).catch((error) => {
            console.error(error);
        });
    };

    return(
        <div className="w-full flex flex-col mb-12">
            <button onClick={() => navigate(`/entrepeneurship/${companyId}/projects`)} className="w-full flex flex-row items-center mt-12">
                <ChevronLeft/>
                <p>Regresar</p>
            </button>

            {loading && (
                <p className="mt-8 text-[#959595]">Cargando proyecto...</p>
            )}

            {error && (
                <p className="mt-8 text-red-400">{error}</p>
            )}

            {!loading && !error && project && (
                <>
                    <div className="w-full flex justify-between items-center mt-8">
                        <p>{project.name}</p>

                        <div className="flex items-center gap-6">
                            {/* Solo aplica al negocio de concientización en
                                seguridad, no a evaluación de vulnerabilidades */}
                            {businessContext?.isSecurityAwarenessBusiness && (
                                <button
                                    onClick={() => navigate(`/entrepeneurship/${companyId}/projects/${projectId}/campaigns`)}
                                    className="flex items-center gap-2 bg-[#232323] hover:bg-[#2F2F2F] rounded-md px-3 py-1 text-sm transition duration-300"
                                >
                                    <Fish size={14} />
                                    <p>Campañas de phishing</p>
                                </button>
                            )}

                            <p>Porcentaje: {project.progress}%</p>
                        </div>
                    </div>

                    {[...project.phases]
                        .sort((a, b) => a.order - b.order)
                        .map((phase) => (
                            <div key={phase._id} className="w-full flex flex-col">
                                <div className="border-b border-b-[#777777] w-full mt-8 mb-8"></div>

                                <div className="w-full flex justify-between">
                                    <p>{phase.name}</p>
                                    <p>Porcentaje: {getPhaseProgress(phase)}%</p>
                                </div>

                                <div className="w-full flex flex-row bg-[#171717] rounded-lg shadow-lg p-6 mt-3 gap-12">
                                    {COLUMNS.map((column) => {

                                        const tasks = phase.checklist.filter(
                                            (task) => task.status === column.status
                                        );

                                        const columnKey = `${phase._id}-${column.status}`;

                                        return (
                                            <div
                                                key={columnKey}
                                                onDragOver={(event) => {
                                                    event.preventDefault();
                                                    setDraggedOverColumn(columnKey);
                                                }}
                                                onDragLeave={() =>
                                                    setDraggedOverColumn((current) =>
                                                        current === columnKey ? null : current
                                                    )
                                                }
                                                onDrop={(event) => handleDrop(event, column.status)}
                                                className={`w-1/3 flex flex-col rounded-md p-4 gap-3 transition-colors ${
                                                    draggedOverColumn === columnKey
                                                        ? "bg-[#232323] outline-1 outline-dashed outline-[#2F76D2]"
                                                        : "bg-[#1A1A1A]"
                                                }`}
                                            >
                                                <p className="mb-2">{column.label}</p>

                                                {tasks.length === 0 && (
                                                    <p className="text-sm text-[#5c5c5c]">Sin tareas</p>
                                                )}

                                                {tasks.map((task) => (
                                                    <div
                                                        key={task._id}
                                                        draggable
                                                        onDragStart={(event) =>
                                                            handleDragStart(event, phase._id, task._id)
                                                        }
                                                        className="w-full flex flex-col bg-[#212121] rounded-sm p-3 cursor-grab active:cursor-grabbing"
                                                    >
                                                        <p className="text-sm">{task.task}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                </>
            )}
        </div>
    )
}

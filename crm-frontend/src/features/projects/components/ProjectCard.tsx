import { useNavigate, useParams } from "react-router-dom";

import {motion} from "framer-motion"

import { List } from "lucide-react";
import { Calendar } from "lucide-react";

import type { Project } from "../types/project.types";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({project}: ProjectCardProps) {

    const navigate = useNavigate();
    const { companyId } = useParams();

    const totalTasks = project.phases.reduce(
        (total, phase) => total + phase.checklist.length,
        0
    );

    const completedTasks = project.phases.reduce(
        (total, phase) =>
            total + phase.checklist.filter((task) => task.status === "Completado").length,
        0
    );

    const formattedDate =
        project.dueDate
            ? new Date(project.dueDate).toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric"
            })
            : "Sin fecha";

    return(
        <motion.button 
            onClick={() => navigate(`/entrepeneurship/${companyId}/projects/${project._id}`)} 
            className="bg-[#1A1A1A] rounded-md shadow-lg px-4 py-4 cursor-pointer"
            whileHover={{ y: -6, scale: 1.02}}
            whileTap={{ scale: 0.98}}
            transition={{ type: "spring", stiffness: 300, damping: 20}}>
                
            <p className="text-start">{project.name}</p>
            <div className="border-b border-b-[#777777]"></div>
            <div className="flex justify-between pt-2">
                <div className="flex gap-1 items-center">
                    <List size={15} />
                    <p className="text-sm text-[#959595]">{completedTasks}/{totalTasks}</p>

                </div>
                <p className="text-sm text-[#959595]">{project.progress}% Completado</p>
            </div>
            <div className="rounded-2xl w-full bg-slate-300 h-1 mt-2">
                <div
                    className="rounded-2xl h-full bg-[#2F76D2]"
                    style={{ width: `${project.progress}%` }}
                />
            </div>
            <div className="flex gap-1 items-center mt-2">
                <Calendar size={15} />
                <p className="text-sm text-[#959595]">Fecha límite</p>
            </div>
            <p className="text-sm mt-2 text-start">{formattedDate}</p>
        </motion.button>
    )
}

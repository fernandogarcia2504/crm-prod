import { useParams } from "react-router-dom";

import {motion} from "framer-motion";

import ProjectCard from "../components/ProjectCard";

import { useProjects } from "../hooks/useProjects";

export default function ProjectsPage() {

    const { companyId } = useParams();

    const { projects, loading, error } = useProjects(companyId ?? null);

   return(
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col">

            {loading && (
                <p className="mt-12 text-[#959595]">Cargando proyectos...</p>
            )}

            {error && (
                <p className="mt-12 text-red-400">{error}</p>
            )}

            {!loading && !error && projects.length === 0 && (
                <p className="mt-12 text-[#959595]">No hay proyectos registrados para esta empresa. Un proyecto se crea automáticamente cuando una oportunidad se marca como Ganado.</p>
            )}

            <div className="w-full grid grid-cols-3 gap-12 mt-12">

                {!loading && !error && projects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                ))}

            </div>

        </motion.div>
    )
}

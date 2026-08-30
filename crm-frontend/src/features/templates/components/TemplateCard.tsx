import { useNavigate } from "react-router-dom";

import {motion} from "framer-motion"
import { File } from "lucide-react";

import type { ServiceTemplate } from "../types/templates.types";

interface TemplateCardProps {
    serviceTemplate: ServiceTemplate;
}

export default function TemplatesCard({serviceTemplate}: TemplateCardProps) {

    const navigate = useNavigate();

    return(
        <motion.div 
            onClick={() => navigate(`/entrepeneurship/templates/${serviceTemplate._id}`)}
            className="bg-[#1A1A1A] w-full rounded-md shadow-lg px-4 py-4 flex flex-col gap-4 cursor-pointer"
            whileHover={{ y: -6, scale: 1.02}}
            whileTap={{ scale: 0.98}}
            transition={{ type: "spring", stiffness: 300, damping: 20}}>

            <div className="bg-[#959595] rounded-lg flex items-center justify-center h-24">
                <File size={32} color="red" />
            </div>
            <p>{serviceTemplate.name}</p>
            <p className="text-sm text-[#959595]">{serviceTemplate.description}</p>

            <div className="w-1/2 rounded-lg bg-[#171717] py-1 flex items-center justify-center">
                <p className="text-sm">Duracion estimada: {serviceTemplate.estimatedDuration}</p>
            </div>
        </motion.div>
    )
}
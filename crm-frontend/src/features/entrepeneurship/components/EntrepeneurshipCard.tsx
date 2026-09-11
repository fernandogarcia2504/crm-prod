import { motion } from "framer-motion";
import { FishingHook } from "lucide-react";

interface EntrepeneurshipCardProps {
    title: string;
    description: string;
    onClick: () => void;
}

export default function EntrepeneurshipCard({ title, description, onClick }: EntrepeneurshipCardProps) {

    return(
        <motion.button
            onClick={ onClick }
            whileHover={{ y: -6, scale: 1.02}}
            whileTap={{ scale: 0.98}}
            transition={{ type: "spring", stiffness: 300, damping: 20}}
            className="bg-[#242424] rounded-md shadow-lg w-full sm:w-[45%] md:w-[30%] lg:w-[25%] px-3 flex flex-col items-center justify-center gap-3 py-14 sm:py-16 md:py-24 hover:border hover:border-[#2F76D2] transition duration-200">
            
            <FishingHook />

            <p className="text-center font-bold">
                {title}
            </p>

            <p className="text-[#959595] text-center">
                {description}
            </p>
        </motion.button>
    )
}
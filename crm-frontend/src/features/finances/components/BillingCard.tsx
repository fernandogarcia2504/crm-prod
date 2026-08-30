import { motion } from "framer-motion";

import { MoveUp } from 'lucide-react';

interface SetBillingCardProps {
    billing: string;
}

export default function BillingCard({billing}: SetBillingCardProps) {

    return(
        <motion.div
            whileHover={{ backgroundColor: "#242424" }}
            transition={{ duration: 0.2 }}
            className=" flex flex-col w-[30%] bg-[#1A1A1A] mt-8 px-3 py-2 gap-3 rounded-md shadow-lg"
        >
            <p className="text-sm font-bold">Facturación del mes</p>
            
            <p className="text-sm">${billing}</p>

            <div className="flex items-center gap-2">
                <MoveUp size={12} color="green" />
                <p className="text-sm text-[#2FD260]">%15</p>
                <p className="text-sm text-[#959595]"> vs el mes de junio 2026</p>
            </div> 

        </motion.div>
    )
}
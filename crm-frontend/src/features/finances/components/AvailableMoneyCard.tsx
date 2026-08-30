import { motion } from "framer-motion";

import { MoveUp } from 'lucide-react';

interface SetAvailableMoneyProps {
    amount: number;
}

export default function AvailableMoneyCard({amount}: SetAvailableMoneyProps) {

    return(
        <motion.div
            whileHover={{ backgroundColor: "#242424" }}
            transition={{ duration: 0.2 }}
            className=" flex flex-col w-[30%] bg-[#1A1A1A] mt-8 px-3 py-2 gap-3 rounded-md shadow-lg"
        >
            <p className="text-sm font-bold">Dinero disponible</p>
            
            <p className="text-sm">${amount}</p>

            <p className="text-sm text-[#959595]">En la cuenta bancaria</p>

        </motion.div>
    )
}
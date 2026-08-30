import { motion } from "framer-motion";

interface SetPendingBillingCardProps {
    pendingBilling: number;
}

export default function PendingBillingCard({pendingBilling}: SetPendingBillingCardProps) {

    return(
        <motion.div
            whileHover={{ backgroundColor: "#242424" }}
            transition={{ duration: 0.2 }}
            className=" flex flex-col w-[20%] bg-[#1A1A1A] mt-8 px-3 py-2 gap-3 rounded-md shadow-lg"
        >
            <p className="text-sm font-bold">Pendiente por cobrar</p>

            <p>${pendingBilling}</p>

            <p className="text-sm text-[#959595]">6 Facturas pendientes</p>
        </motion.div>
    )
}
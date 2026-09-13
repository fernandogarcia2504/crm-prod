import { motion } from "framer-motion";

interface SetAverageBillingCardProps {
    billing: number;
}

const formatCurrency = (value: number) => `$${Math.round(value).toLocaleString("es-MX")}`;

export default function AverageBillingCard({billing}: SetAverageBillingCardProps) {

    return(
        <motion.div
            whileHover={{ backgroundColor: "#242424" }}
            transition={{ duration: 0.2 }}
            className=" flex flex-col w-full sm:w-[30%] bg-[#1A1A1A] mt-8 px-3 py-2 gap-3 rounded-md shadow-lg"
        >
            <p className="text-sm font-bold">Ticket promedio por cliente</p>

            <p className="text-sm">{formatCurrency(billing)}</p>

            <p className="text-sm text-[#959595]">En lo que va del año</p>

        </motion.div>
    )
}

import { motion } from "framer-motion";

import { MoveUp, MoveDown } from 'lucide-react';

interface SetBillingCardProps {
    billing: number;
    changePercent: number | null;
    previousMonthLabel: string | null;
}

const formatCurrency = (value: number) => `$${Math.round(value).toLocaleString("es-MX")}`;

export default function BillingCard({billing, changePercent, previousMonthLabel}: SetBillingCardProps) {

    const isPositive = (changePercent ?? 0) >= 0;

    return(
        <motion.div
            whileHover={{ backgroundColor: "#242424" }}
            transition={{ duration: 0.2 }}
            className=" flex flex-col w-full sm:w-[30%] bg-[#1A1A1A] mt-8 px-3 py-2 gap-3 rounded-md shadow-lg"
        >
            <p className="text-sm font-bold">Facturación del mes</p>

            <p className="text-sm">{formatCurrency(billing)}</p>

            {changePercent === null ? (
                <p className="text-sm text-[#959595]">
                    {previousMonthLabel
                        ? `Sin facturación en ${previousMonthLabel} para comparar`
                        : "Sin datos del mes anterior"}
                </p>
            ) : (
                <div className="flex items-center gap-2">
                    {isPositive
                        ? <MoveUp size={12} color="#2FD260" />
                        : <MoveDown size={12} color="#F25555" />}
                    <p className={`text-sm ${isPositive ? "text-[#2FD260]" : "text-[#F25555]"}`}>
                        {Math.abs(changePercent).toFixed(1)}%
                    </p>
                    <p className="text-sm text-[#959595]"> vs {previousMonthLabel}</p>
                </div>
            )}

        </motion.div>
    )
}

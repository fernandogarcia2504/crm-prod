import { motion } from "framer-motion";

interface SetProcessCardProps {
    quantity: number;
    goal: number;
    remaining: number;
    progressPercent: number;
}

const formatCurrency = (value: number) => `$${Math.round(value).toLocaleString("es-MX")}`;

export default function ProcessCard({quantity, goal, remaining, progressPercent}: SetProcessCardProps) {

    return(
        <motion.div
            whileHover={{ backgroundColor: "#242424" }}
            transition={{ duration: 0.2 }}
            className=" flex flex-col w-full sm:w-[30%] bg-[#1A1A1A] mt-8 px-3 py-2 gap-3 rounded-md shadow-lg"
        >
            <p className="text-sm font-bold">Proceso hasta llegar al millon</p>
            <div className="flex items-center gap-2">
                <p className="text-sm">{formatCurrency(quantity)}</p>
                <p className="font-bold">/{formatCurrency(goal)}</p>
            </div>

            <div className="rounded-2xl w-full bg-slate-300 h-1 mt-2">
                <div className="rounded-2xl h-full bg-[#2F76D2]" style={{ width: `${progressPercent}%` }}></div>
            </div>

            <p className="text-[#959595] text-sm">
                {remaining > 0
                    ? `Faltan ${formatCurrency(remaining)} para la meta anual`
                    : "¡Meta anual alcanzada!"}
            </p>

        </motion.div>
    )
}

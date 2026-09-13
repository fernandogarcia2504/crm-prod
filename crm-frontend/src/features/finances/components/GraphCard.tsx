import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import type { MonthlyBreakdownEntry } from "../types/finance.types";

interface GraphCardProps {
    data: MonthlyBreakdownEntry[];
    goal: number;
}

export default function GraphCard({data, goal}: GraphCardProps) {

    return(
        <motion.div
            whileHover={{ backgroundColor: "#242424" }}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-full bg-[#1A1A1A] mt-8 px-3 py-2 gap-3 rounded-md shadow-lg"
        >
            <p className="text-sm font-bold">
                Facturación acumulada vs objetivo anual
            </p>

            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 20,
                            left: 10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid
                            stroke="#333333"
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="month"
                            stroke="#959595"
                            tick={{ fill: "#959595", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            domain={[0, goal]}
                            stroke="#959595"
                            tick={{ fill: "#959595", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) =>
                                `$${value / 1000}k`
                            }
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#212121",
                                border: "1px solid #333333",
                                borderRadius: "6px",
                            }}
                            labelStyle={{
                                color: "#ECECEC",
                            }}
                            formatter={(value) =>
                                `$${Number(value).toLocaleString("es-MX")}`
                            }
                        />

                        <Line
                            type="monotone"
                            dataKey="facturacion"
                            stroke="#2F76D2"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="objetivo"
                            stroke="#959595"
                            strokeWidth={2}
                            strokeDasharray="6 6"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}

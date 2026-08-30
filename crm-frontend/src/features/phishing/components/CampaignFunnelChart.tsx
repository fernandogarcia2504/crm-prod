import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

import type { CampaignMetrics } from "../types/phishingCampaign.types";

interface CampaignFunnelChartProps {
    metrics: CampaignMetrics;
}

const FUNNEL_COLORS = ["#2F76D2", "#3550CB", "#8B5CF6", "#E0742F", "#DC3D3D"];

export default function CampaignFunnelChart({ metrics }: CampaignFunnelChartProps) {

    const data = [
        { stage: "Enviados", value: metrics.sent },
        { stage: "Abiertos", value: metrics.opened },
        { stage: "Clics", value: metrics.clicked },
        { stage: "Envió datos", value: metrics.submittedData },
        { stage: "Reportó", value: metrics.reported }
    ];

    return (
        <div className="w-full bg-[#171717] rounded-md p-4 mt-6" style={{ height: 260 }}>
            <p className="text-sm text-[#959595] mb-2">Embudo de la campaña</p>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <XAxis dataKey="stage" stroke="#5c5c5c" fontSize={12} tickLine={false} axisLine={{ stroke: "#333" }} />
                    <YAxis stroke="#5c5c5c" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                        contentStyle={{ background: "#212121", border: "1px solid #333", borderRadius: 6 }}
                        labelStyle={{ color: "#ECECEC" }}
                        itemStyle={{ color: "#ECECEC" }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={entry.stage} fill={FUNNEL_COLORS[index]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

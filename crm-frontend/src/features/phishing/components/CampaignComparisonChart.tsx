import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

import type { PhishingCampaign } from "../types/phishingCampaign.types";

interface CampaignComparisonChartProps {
    campaigns: PhishingCampaign[];
}

// Compara la tasa de clics y de reporte entre campañas del mismo proyecto,
// para poder leer de un vistazo si el baseline mejoró tras el curso
export default function CampaignComparisonChart({ campaigns }: CampaignComparisonChartProps) {

    // Orden cronológico (más vieja primero) para que se lea como progreso
    const data = [...campaigns]
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map((campaign) => ({
            name: campaign.name,
            "Tasa de clics": campaign.metrics.clickRate,
            "Tasa de reporte": campaign.metrics.reportRate
        }));

    return (
        <div className="w-full bg-[#171717] rounded-md p-4 mt-8" style={{ height: 280 }}>
            <p className="text-sm text-[#959595] mb-2">Comparativo entre campañas (baseline vs. reforzamiento)</p>
            <ResponsiveContainer width="100%" height="88%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#5c5c5c" fontSize={12} tickLine={false} axisLine={{ stroke: "#333" }} />
                    <YAxis stroke="#5c5c5c" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                    <Tooltip
                        contentStyle={{ background: "#212121", border: "1px solid #333", borderRadius: 6 }}
                        labelStyle={{ color: "#ECECEC" }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, color: "#959595" }} />
                    <Bar dataKey="Tasa de clics" fill="#DC3D3D" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Tasa de reporte" fill="#2F76D2" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

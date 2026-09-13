import Business from "../models/business.model.js";
import Project from "../models/project.model.js";

// Meta anual de facturacion. Fija por ahora (no hay UI para cambiarla).
const ANNUAL_GOAL = 1000000;

const MONTH_LABELS = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

// Resumen financiero de un negocio: progreso hacia la meta anual,
// facturacion del mes en curso, ticket promedio por cliente y la
// facturacion acumulada mes a mes para la grafica. Todo se calcula a
// partir de los proyectos con finalAmount y billedAt capturados (se
// capturan al ganar la oportunidad, ver activity.controller.js).
export const getFinanceSummary = async (req, res) => {

    try {

        const { businessId } = req.params;

        const business = await Business.findById(businessId);

        if (!business) {
            return res.status(404).json({
                message: "El negocio no existe"
            });
        }

        const now = new Date();
        const currentYear = now.getFullYear();
        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear + 1, 0, 1);

        const billedProjects = await Project.find({
            business: businessId,
            finalAmount: { $ne: null },
            billedAt: { $gte: yearStart, $lt: yearEnd }
        }).select("finalAmount billedAt company");

        const yearTotal = billedProjects.reduce(
            (sum, project) => sum + (project.finalAmount || 0),
            0
        );

        const monthlyTotals = Array(12).fill(0);

        billedProjects.forEach((project) => {
            const monthIndex = new Date(project.billedAt).getMonth();
            monthlyTotals[monthIndex] += project.finalAmount || 0;
        });

        // Facturacion acumulada mes a mes, para la grafica vs objetivo.
        let running = 0;

        const monthlyBreakdown = monthlyTotals.map((total, index) => {
            running += total;

            return {
                month: MONTH_LABELS[index],
                facturacion: running,
                objetivo: ANNUAL_GOAL
            };
        });

        const currentMonthIndex = now.getMonth();
        const currentMonthTotal = monthlyTotals[currentMonthIndex];

        const previousMonthTotal =
            currentMonthIndex === 0
                ? null
                : monthlyTotals[currentMonthIndex - 1];

        const monthOverMonthChangePercent =
            previousMonthTotal === null || previousMonthTotal === 0
                ? null
                : ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;

        // Ticket promedio por cliente: se agrupa por empresa, no por
        // proyecto (una empresa con varios proyectos facturados cuenta
        // una sola vez, con la suma de sus proyectos).
        const totalsByCompany = new Map();

        billedProjects.forEach((project) => {
            const companyId = String(project.company);

            totalsByCompany.set(
                companyId,
                (totalsByCompany.get(companyId) || 0) + (project.finalAmount || 0)
            );
        });

        const companyTotals = Array.from(totalsByCompany.values());

        const averageTicket = companyTotals.length
            ? companyTotals.reduce((sum, value) => sum + value, 0) / companyTotals.length
            : 0;

        const progressPercent = Math.min(
            100,
            Math.round((yearTotal / ANNUAL_GOAL) * 1000) / 10
        );

        const remaining = Math.max(0, ANNUAL_GOAL - yearTotal);

        return res.status(200).json({
            summary: {
                goal: ANNUAL_GOAL,
                year: currentYear,
                yearTotal,
                remaining,
                progressPercent,
                currentMonth: {
                    label: MONTH_LABELS[currentMonthIndex],
                    total: currentMonthTotal
                },
                previousMonth: previousMonthTotal === null
                    ? null
                    : {
                        label: MONTH_LABELS[currentMonthIndex - 1],
                        total: previousMonthTotal
                    },
                monthOverMonthChangePercent,
                averageTicket,
                monthlyBreakdown
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener el resumen financiero"
        });

    }

};

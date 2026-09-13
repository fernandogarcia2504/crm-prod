import {motion} from "framer-motion"

import ProcessCard from "../components/ProcessCard"
import BillingCard from "../components/BillingCard"
import AverageBillingCard from "../components/AverageBillingCard"
import GraphCard from "../components/GraphCard"

import { useFinanceSummary } from "../hooks/useFinanceSummary"

export default function FinancesPage() {

    const businessId = localStorage.getItem("businessId");

    const { summary, loading, error } = useFinanceSummary(businessId);

    return(
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col pb-16">
            <div className="w-full flex justify-start mt-12">
                <p className="font-bold">Resumen Financiero</p>
            </div>

            {loading && (
                <p className="mt-8 text-[#959595]">Cargando resumen financiero...</p>
            )}

            {error && (
                <p className="mt-8 text-red-400">{error}</p>
            )}

            {!loading && !error && summary && (
                <div className="w-full">
                    <div className="flex flex-col sm:flex-row flex-wrap justify-between gap-3">
                        <ProcessCard
                            quantity={summary.yearTotal}
                            goal={summary.goal}
                            remaining={summary.remaining}
                            progressPercent={summary.progressPercent}
                        />
                        <BillingCard
                            billing={summary.currentMonth.total}
                            changePercent={summary.monthOverMonthChangePercent}
                            previousMonthLabel={summary.previousMonth?.label ?? null}
                        />
                        <AverageBillingCard billing={summary.averageTicket} />
                    </div>

                    <GraphCard data={summary.monthlyBreakdown} goal={summary.goal} />
                </div>
            )}

        </motion.div>
    )
}

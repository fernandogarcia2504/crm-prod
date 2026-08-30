import {motion} from "framer-motion"

import ProcessCard from "../components/ProcessCard"
import BillingCard from "../components/BillingCard"
import PendingBillingCard from "../components/PendingBillingCard"
import PendingAdvanceCard from "../components/PendingAdvanceCard"
import AverageBillingCard from "../components/AverageBillingCard"
import GraphCard from "../components/GraphCard"
import AvailableMoneyCard from "../components/AvailableMoneyCard"
export default function FinancesPage() {


    return(
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col pb-16">
            <div className="w-full flex justify-start mt-12">
                <p className="font-bold">Resumen Financiero</p>
            </div>

            <div className="w-full">
                <div className="flex flex-row justify-between gap-3">
                    <ProcessCard quantity={482000} />
                    <BillingCard billing="87300" />
                    <PendingBillingCard pendingBilling={92100} />
                    <PendingAdvanceCard pendingAdvance={100000} />
                </div>
                <div className="w-full flex gap-3">
                <AvailableMoneyCard amount={72000} />
                <AverageBillingCard billing={32000} />
                </div>

                <GraphCard />
            </div>


        </motion.div>
    )
}
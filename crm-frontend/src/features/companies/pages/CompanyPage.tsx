import { useState } from "react";

import {motion} from "framer-motion"

import CreateButton from "../../../components/ui/buttons/CreateButton"
import CompanyPopup from "../componentes/CompanyPopup";
import CompanyCard from "../componentes/CompanyCard";

import { useCompanies } from "../hooks/useCompanies";
 
export default function CompanyPage() {

    const businessId = localStorage.getItem("businessId");
    const [isOpenPopup, setIsOpenPopup] = useState(false);

    const { companies, loading, error, createCompany} = useCompanies(businessId);

    return(
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col">
            <div className="w-full flex justify-end mt-12">
                <CreateButton title="Agregar Empresa" onClick={() => setIsOpenPopup(true)} />
            </div>

            <div className="w-full grid grid-cols-[20%_10%_25%_25%_20%] pt-12">
                <p className="text-[#959595] ">Empresa</p>
                <p className="text-[#959595] ">Tamaño</p>
                <p className="text-[#959595] ">Sitio Web</p>
                <p className="text-[#959595] ">Estatus</p>
                <p className="text-[#959595] text-right">Lead Source</p>
            </div>

            {loading && (
                <p className="mt-8 text-[#959595]">
                    Cargando empresas...
                </p>
            )}


            {error && (
                <p className="mt-8 text-red-400">
                    {error}
                </p>
            )}


            {!loading && !error && (
                companies.map((company) => (
                    <CompanyCard
                        key={company._id}
                        company={company}
                    />
                ))
            )}

            {isOpenPopup && (
                <div
                    className="fixed inset-0  flex items-center justify-center z-50"
                    onClick={() => setIsOpenPopup(false)}
                >
                        <CompanyPopup onClose={() => setIsOpenPopup(false)} createCompany={createCompany} />
                </div>
            )}

        </motion.div>
    )
}
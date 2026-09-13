import { useState } from "react";

import {motion} from "framer-motion"

import CreateButton from "../../../components/ui/buttons/CreateButton"
import CompanyPopup from "../componentes/CompanyPopup";
import CompanyCard from "../componentes/CompanyCard";

import { useCompanies } from "../hooks/useCompanies";

import type { Company } from "../types/company.types";

export default function CompanyPage() {

    const businessId = localStorage.getItem("businessId");
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);

    const { companies, loading, error, createCompany, updateCompany, deleteCompany } = useCompanies(businessId);

    const handleOpenCreate = () => {
        setEditingCompany(null);
        setIsOpenPopup(true);
    };

    const handleEdit = (company: Company) => {
        setEditingCompany(company);
        setIsOpenPopup(true);
    };

    const handleClosePopup = () => {
        setIsOpenPopup(false);
        setEditingCompany(null);
    };

    const handleDelete = async (companyId: string) => {
        if (!window.confirm("¿Eliminar esta empresa? Se eliminarán también todos los proyectos, contactos, actividades, oportunidades, empleados, documentos y campañas de phishing relacionados. Esta acción no se puede deshacer.")) return;
        await deleteCompany(companyId);
    };

    return(
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col">
            <div className="w-full flex justify-end mt-12">
                <CreateButton title="Agregar Empresa" onClick={handleOpenCreate} />
            </div>

            <div className="w-full overflow-x-auto">
                <div className="min-w-[920px]">
                    <div className="w-full grid grid-cols-[16%_10%_20%_14%_14%_14%_12%] pt-12">
                        <p className="text-[#959595] ">Empresa</p>
                        <p className="text-[#959595] ">Tamaño</p>
                        <p className="text-[#959595] ">Sitio Web</p>
                        <p className="text-[#959595] ">Estatus</p>
                        <p className="text-[#959595] ">Tipo de Empresa</p>
                        <p className="text-[#959595] ">Lead Source</p>
                        <p className="text-[#959595] text-right">Acciones</p>
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
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>
            </div>

            {isOpenPopup && (
                <div
                    className="fixed inset-0  flex items-center justify-center z-50"
                    onClick={handleClosePopup}
                >
                        <CompanyPopup
                            onClose={handleClosePopup}
                            createCompany={createCompany}
                            updateCompany={updateCompany}
                            company={editingCompany}
                        />
                </div>
            )}

        </motion.div>
    )
}

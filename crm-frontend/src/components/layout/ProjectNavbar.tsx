import { useState } from "react"
import { useContext } from "react"
import { NavLink, useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import { Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { BusinessContext } from "../../app/context/BusinessContext"

export default function ProjectNavbar() {

    const navigate = useNavigate();
    const {companyId} = useParams();

    const businessContext = useContext(BusinessContext);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const links = [
        { to: `/entrepeneurship/${companyId}/resume`, label: "Resumen" },
        { to: `/entrepeneurship/${companyId}/contacts`, label: "Contactos" },
        { to: `/entrepeneurship/${companyId}/projects`, label: "Proyectos" },
        { to: `/entrepeneurship/${companyId}/documents`, label: "Documentos" },
        { to: `/entrepeneurship/${companyId}/activities`, label: "Actividades" },
        { to: `/entrepeneurship/${companyId}/opportunities`, label: "Oportunidades" },
        ...(businessContext?.isSecurityAwarenessBusiness
            ? [
                { to: `/entrepeneurship/${companyId}/employees`, label: "Empleados" },
                { to: `/entrepeneurship/${companyId}/grades`, label: "Calificaciones" }
            ]
            : [])
    ];

    return(
        <div className="w-[94%] sm:w-[90%] md:w-[80%] flex flex-col py-4">
            <div className="w-full flex items-center gap-4 md:gap-12 border-b border-b-[#777777] py-4">

                <button
                    type="button"
                    onClick={() => setIsMenuOpen((current) => !current)}
                    className="md:hidden cursor-pointer"
                    aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>

                <div className="hidden md:block">
                    <Menu />
                </div>

                <div className="flex-1 min-w-0">
                    <p onClick={() => navigate("/entrepeneurship/companies")} className="font-bold cursor-pointer truncate">{businessContext?.business?.name ?? "..."}</p>
                </div>

                <div className="hidden md:flex gap-12">
                    {links.map((link) => (
                        <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? "text-[#2F76D2]" : "text-[#ECECEC]"}>{link.label}</NavLink>
                    ))}
                </div>

                <div className="hidden md:block flex-1" />

            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden w-full overflow-hidden border-b border-b-[#777777]"
                    >
                        <div className="w-full flex flex-col gap-1 py-3">
                            {links.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) => `w-full py-2 px-2 rounded-md ${isActive ? "text-[#2F76D2] bg-[#1A1A1A]" : "text-[#ECECEC]"}`}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}

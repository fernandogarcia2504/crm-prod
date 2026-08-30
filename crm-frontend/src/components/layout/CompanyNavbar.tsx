import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import { Menu } from "lucide-react"

import { BusinessContext } from "../../app/context/BusinessContext"

export default function CompanyNavbar() {
    
    const navigate = useNavigate();
    const businessContext = useContext(BusinessContext);

    return(
        <div className="w-[80%] flex flex-row items-center py-4 gap-12">
            <div>
                <Menu />
            </div>

            <div className="w-full flex items-center gap-12 border-b border-b-[#777777] py-4">
                <div className="flex-1">
                    <p onClick={() => navigate("/entrepeneurship/companies")} className="font-bold cursor-pointer">{businessContext?.business?.name ?? "..."}</p>
                </div>

                <div className="flex gap-12">
                    <NavLink to={"/entrepeneurship/companies"} className={({ isActive }) => isActive ? "text-[#2F76D2]" : "text-[#ECECEC]"}>Empresas</NavLink>
                    <NavLink to={"/entrepeneurship/finances"} className={({ isActive }) => isActive ? "text-[#2F76D2]" : "text-[#ECECEC]"}>Finanzas</NavLink>
                    <NavLink to={"/entrepeneurship/templates"} className={({ isActive }) => isActive ? "text-[#2F76D2]" : "text-[#ECECEC]"}>Templates</NavLink>
                    <NavLink to={"/entrepeneurship/contacts"} className={({ isActive }) => isActive ? "text-[#2F76D2]" : "text-[#ECECEC]"}>Contactos</NavLink>

                    {businessContext?.isSecurityAwarenessBusiness && (
                        <NavLink to={"/entrepeneurship/course"} className={({ isActive }) => isActive ? "text-[#2F76D2]" : "text-[#ECECEC]"}>Curso</NavLink>
                    )}

                </div>

                <div className="flex-1" />

            </div>


        </div>
    )
}
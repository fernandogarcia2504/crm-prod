import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import { Pencil, Trash } from "lucide-react";

import type { Company } from "../types/company.types";

interface CompanyCardProps {
    company: Company;
    onEdit: (company: Company) => void;
    onDelete: (companyId: string) => void;
}


export default function CompanyCard({company, onEdit, onDelete}: CompanyCardProps) {

    const navigate = useNavigate()

    return(
        <motion.div
            onClick={() => navigate(`/entrepeneurship/${company._id}/contacts`)}
            whileHover={{ backgroundColor: "#242424" }}
            transition={{ duration: 0.2 }}
            className="w-full grid grid-cols-[16%_10%_20%_14%_14%_14%_12%] mt-8 py-2 rounded-md cursor-pointer items-center"
        >
            <motion.p whileHover={{ x: 2 }} className="">{company.name}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="">{company.companySize}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="">{company.website}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="">{company.status}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="">{company.type}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="">{company.leadSource}</motion.p>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(company);
                    }}
                    className="cursor-pointer"
                >
                    <Pencil size={16} color="#959595" />
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(company._id);
                    }}
                    className="cursor-pointer"
                >
                    <Trash size={16} color="red" />
                </button>
            </div>
        </motion.div>
    )
}

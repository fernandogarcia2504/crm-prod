import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import type { Company } from "../types/company.types";

interface CompanyCardProps {
    company: Company;
}


export default function CompanyCard({company}: CompanyCardProps) {

    const navigate = useNavigate()

    return(
        <motion.div
            onClick={() => navigate(`/entrepeneurship/${company._id}/contacts`)}
            whileHover={{ backgroundColor: "#242424" }}
            transition={{ duration: 0.2 }}
            className="w-full grid grid-cols-[20%_10%_25%_25%_20%] mt-8 py-2 rounded-md cursor-pointer"
        >
            <motion.p whileHover={{ x: 2 }} className="">{company.name}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="">{company.companySize}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="">{company.website}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="">{company.status}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="text-right">{company.leadSource}</motion.p>
        </motion.div>
    )
}
import { motion } from "framer-motion";

import type { Contact } from "../types/contact.types";

interface ContactCardProps {
    contact: Contact;
}

export default function CompanyContactCard({contact}: ContactCardProps) {

    return(
        <motion.div
            whileHover={{ backgroundColor: "#242424" }}
            transition={{ duration: 0.2 }}
            className="w-full grid grid-cols-[20%_20%_20%_30%_10%] mt-8 py-2 rounded-md"
        >
            <motion.p whileHover={{ x: 2 }} className="">{contact.fullName}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="">{contact.position}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="">{contact.phone}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="">{contact.email}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="text-right">{contact.isPrimary}</motion.p>
        </motion.div>
    )
}
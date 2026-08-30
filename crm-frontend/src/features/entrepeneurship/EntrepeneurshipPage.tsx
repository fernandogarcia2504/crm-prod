import { useContext, useEffect, useState } from "react";

import { BusinessContext } from "../../app/context/BusinessContext";

import { motion } from "framer-motion";
import EntrepeneurshipCard from "./components/EntrepeneurshipCard";
import { useNavigate } from "react-router-dom";

interface Business {
    _id: string;
    name: string;
    description: string
}

export default function EntrepeneurshipPage() {

    const navigate = useNavigate();

    const businessContext = useContext(BusinessContext)

    const [businessess, setBusinessess] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleSelectBusiness = (businessId: string) => {
        if (!businessContext) {
            throw new Error("Business context no disponible")
        }

        businessContext.setBusiness(businessId);
        navigate(`/entrepeneurship/companies`);

    }

    useEffect(() => {
        const getBusinessess = async () => {
            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:3000/api/business",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if(!response.ok) {
                    throw new Error(
                        data.message || "Error al obtener los negocios"
                    )
                }

                setBusinessess(data.businesses)
            } catch( error: unknown ) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Error al obtener los negocios");
                }

            } finally {
                setLoading(false);
            }
        }
        getBusinessess();
    }, []);

    return(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full flex flex-col items-center h-screen gap-4 pt-24"
        >
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className="text-4xl font-bold"
            >
                El mayor riesgo es no correr ningún riesgo
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.15 }}
            >
                Elige el negocio/emprendimiento
            </motion.p>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.25 }}
                className="text-[#959595]"
            >
                Selecciona el negocio con el que deseas trabajar
            </motion.p>

            {loading && (
                <p className="text-[#959595] mt-12">
                    Cargando negocios...
                </p>
            )}


            {error && (
                <p className="text-red-400 mt-12">
                    {error}
                </p>
            )}

            {!loading && !error && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 1.5,
                        delay: 0.35
                    }}
                    className="w-full flex flex-row gap-12 mt-12 justify-center"
                >

                    {businessess.map((business) => (
                        <EntrepeneurshipCard
                            key={business._id}
                            title={business.name}
                            description={business.description}
                            onClick={() =>
                                handleSelectBusiness(business._id)
                            }
                        />
                    ))}

                </motion.div>
            )}

        </motion.div>
    )
}


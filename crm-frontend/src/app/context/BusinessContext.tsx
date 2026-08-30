import React, {
    createContext,
    useEffect,
    useState
} from "react";

export type BusinessType = "Evaluación de Vulnerabilidades" | "Simulacion Phishing";

export interface Business {
    _id: string;
    name: string;
    description: string;
    type: BusinessType;
    gophishUrl?: string;
    active: boolean;
}

interface BusinessContextType {
    businessId: string | null;
    business: Business | null;
    businessLoading: boolean;
    // Atajo para las features (Empleados, Campañas de phishing) que solo
    // tienen sentido dentro del negocio de concientización en seguridad
    isSecurityAwarenessBusiness: boolean;
    setBusiness: (businessId: string) => void;
    clearBusiness: () => void;
    updateGophishUrl: (gophishUrl: string) => Promise<void>;
}

export const BusinessContext =
    createContext<BusinessContextType | null>(null);

export const BusinessProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {

    const [businessId, setBusinessId] = useState<string | null>(localStorage.getItem("businessId"));
    const [business, setBusinessDoc] = useState<Business | null>(null);
    const [businessLoading, setBusinessLoading] = useState(false);

    useEffect(() => {

        if (businessId) {
            localStorage.setItem("businessId", businessId);
        } else {
            localStorage.removeItem("businessId");
        }

    }, [businessId]);

    // Carga el documento completo del Business seleccionado (nombre, tipo)
    // para que cualquier pantalla pueda saber en que negocio esta parada
    useEffect(() => {

        if (!businessId) {
            setBusinessDoc(null);
            return;
        }

        const fetchBusiness = async () => {
            try {

                setBusinessLoading(true);

                const token = localStorage.getItem("token");

                const response = await fetch(`http://localhost:3000/api/business/${businessId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Error al obtener el negocio");
                }

                setBusinessDoc(data.business);

            } catch (error) {

                console.error(error);
                setBusinessDoc(null);

            } finally {

                setBusinessLoading(false);

            }
        };

        fetchBusiness();

    }, [businessId]);


    const setBusiness = (id: string) => {
        setBusinessId(id);

        localStorage.setItem("businessId", id)
    };


    const clearBusiness = () => {
        setBusinessId(null);
        setBusinessDoc(null);
    };


    const updateGophishUrl = async (gophishUrl: string) => {

        if (!businessId) {
            throw new Error("No hay un negocio seleccionado");
        }

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:3000/api/business/${businessId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ gophishUrl })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al actualizar el servidor de Gophish");
        }

        setBusinessDoc(data.business);
    };


    return (
        <BusinessContext.Provider
            value={{
                businessId,
                business,
                businessLoading,
                isSecurityAwarenessBusiness: business?.name === "Simulacion Phishing",
                setBusiness,
                clearBusiness,
                updateGophishUrl
            }}
        >
            {children}
        </BusinessContext.Provider>
    );
};
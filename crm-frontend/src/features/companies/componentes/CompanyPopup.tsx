import { useState } from "react";

import { Building2, X } from "lucide-react";

import type { CreateCompanyData } from "../types/company.types";

interface CompanyPopupsProps {
    onClose: () => void;

    createCompany: (
        companyData: CreateCompanyData
    ) => Promise<unknown>;
}

export default function CompanyPopup({onClose, createCompany}: CompanyPopupsProps) {

    const [formData, setFormData] = useState<CreateCompanyData> ({
        name: "",
        website: "",
        companySize: "",
        leadSource: "",
        notes: "",
        address: {
            country: "",
            city: "",
            pc: "",
            street: "",
            state: ""
        }
    })


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }))
    }

    const handleAddressChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {

        const { name, value } = e.target;

        setFormData((currentData) => ({
            ...currentData,
            address: {
                ...currentData.address,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {

            setLoading(true);
            setError(null);

            await createCompany(formData);

            onClose();

        } catch (error) {

            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Error al crear la empresa"
            );

        } finally {

            setLoading(false);

        }
    }

    return(
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="w-[27%] bg-[#1A1A1A] flex flex-col p-4 gap-6">

            <button type="button" onClick={onClose}> <X size={14} /></button>

            <div className="flex gap-2">
                <Building2 />
                <p>Agregar nueva empresa</p>
            </div>

            {error && (
                <p className="text-sm text-red-400">
                    {error}
                </p>
            )}

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Nombre de la empresa</p>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa el nombre de la empresa"  />
            </div>
            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Sitio WEB</p>
                <input type="text" name="website" value={formData.website} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa el sitio web..." />
            </div>

            <div className="w-full flex gap-3">
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Numero de empleados</p>
                    <input type="text" name="companySize" value={formData.companySize} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa el numero de empleados..." />
                </div>
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Donde se vio</p>
                    <input type="text" name="leadSource" value={formData.leadSource} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa donde se vio..." />
                </div>
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Notas</p>
                <input type="text" name="notes" value={formData.notes} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa notas a considerar..." />
            </div>

            <div className="w-full flex gap-3">
                <div className="w-1/2 flex flex-col gap-3">
                    <input type="text" name="country" value={formData.address?.country} onChange={handleAddressChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Pais..." />
                </div>
                <div className="w-1/2 flex flex-col gap-3">
                    <input type="text" name="city" value={formData.address?.city} onChange={handleAddressChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ciudad..." />
                </div>
            </div>
            <div className="w-full flex gap-3">
                <div className="w-1/2 flex flex-col gap-3">
                    <input type="text" name="pc" value={formData.address?.pc} onChange={handleAddressChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="CP..." />
                </div>
                <div className="w-1/2 flex flex-col gap-3">
                    <input type="text" name="street" value={formData.address?.street} onChange={handleAddressChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Calle..." />
                </div>
                <div className="w-1/2 flex flex-col gap-3">
                    <input type="text" name="state" value={formData.address?.state} onChange={handleAddressChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Estado..." />
                </div>
            </div>

            <div className="flex justify-center">
                <button className="w-[40%] bg-[#2F76D2] rounded-md px-2 py-1">Crear empresa</button>
            </div>
        </form>
    )
}
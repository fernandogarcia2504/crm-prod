import { useState } from "react";

import { Building2, X } from "lucide-react";

import type { Company, CreateCompanyData, UpdateCompanyData } from "../types/company.types";

interface CompanyPopupsProps {
    onClose: () => void;

    company?: Company | null;

    createCompany: (
        companyData: CreateCompanyData
    ) => Promise<unknown>;

    updateCompany?: (
        companyId: string,
        companyData: UpdateCompanyData
    ) => Promise<unknown>;
}

const COMPANY_TYPES = [
    "Fintech",
    "Despacho Juridico",
    "Despacho Contable",
    "Hospital",
    "Banco",
    "Laboratorio",
    "Retail",
    "E-Commerce",
    "Eduacion",
    "Otro"
];

const emptyFormData: CreateCompanyData = {
    name: "",
    website: "",
    companySize: "",
    leadSource: "",
    type: "Otro",
    notes: "",
    address: {
        country: "",
        city: "",
        pc: "",
        street: "",
        state: ""
    }
};

export default function CompanyPopup({onClose, company, createCompany, updateCompany}: CompanyPopupsProps) {

    const isEditing = Boolean(company);

    const [formData, setFormData] = useState<CreateCompanyData> (
        company
            ? {
                name: company.name,
                website: company.website,
                companySize: company.companySize,
                leadSource: company.leadSource,
                type: company.type ?? "Otro",
                notes: company.notes ?? "",
                address: {
                    country: company.address?.country ?? "",
                    city: company.address?.city ?? "",
                    pc: company.address?.pc ?? "",
                    street: company.address?.street ?? "",
                    state: company.address?.state ?? ""
                }
            }
            : emptyFormData
    )


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

            if (isEditing && company && updateCompany) {
                await updateCompany(company._id, formData);
            } else {
                await createCompany(formData);
            }

            onClose();

        } catch (error) {

            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : `Error al ${isEditing ? "actualizar" : "crear"} la empresa`
            );

        } finally {

            setLoading(false);

        }
    }

    return(
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="w-[92%] sm:w-[70%] md:w-[45%] lg:w-[27%] max-h-[90vh] overflow-y-auto bg-[#1A1A1A] flex flex-col p-4 gap-6">

            <button type="button" onClick={onClose}> <X size={14} /></button>

            <div className="flex gap-2">
                <Building2 />
                <p>{isEditing ? "Editar empresa" : "Agregar nueva empresa"}</p>
            </div>

            {error && (
                <p className="text-sm text-red-400">
                    {error}
                </p>
            )}

            {loading && (
                <p className="mt-8 px-3 text-[#959595]">Cargando empresas...</p>
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
                <p className="text-sm">Tipo de empresa</p>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-md px-3 py-1 bg-[#212121] text-sm [color-scheme:dark]"
                >
                    {COMPANY_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
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
            <div className="w-full flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-1/3 flex flex-col gap-3">
                    <input type="text" name="pc" value={formData.address?.pc} onChange={handleAddressChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="CP..." />
                </div>
                <div className="w-full sm:w-1/3 flex flex-col gap-3">
                    <input type="text" name="street" value={formData.address?.street} onChange={handleAddressChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Calle..." />
                </div>
                <div className="w-full sm:w-1/3 flex flex-col gap-3">
                    <input type="text" name="state" value={formData.address?.state} onChange={handleAddressChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Estado..." />
                </div>
            </div>

            <div className="flex justify-center">
                <button type="submit" disabled={loading} className="w-[40%] bg-[#2F76D2] rounded-md px-2 py-1 disabled:opacity-50">
                    {loading ? (isEditing ? "Guardando..." : "Creando...") : (isEditing ? "Guardar cambios" : "Crear empresa")}
                </button>
            </div>
        </form>
    )
}

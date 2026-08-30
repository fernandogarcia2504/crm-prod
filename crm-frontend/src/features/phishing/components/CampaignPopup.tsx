import { useContext, useEffect, useState } from "react";

import { X, Fish, RefreshCw } from "lucide-react";

import { BusinessContext } from "../../../app/context/BusinessContext";

import { getGophishTemplates, getGophishPages, getGophishSendingProfiles } from "../services/gophishService";
import type { GophishTemplate, GophishPage, GophishSendingProfile } from "../services/gophishService";

import type { CreateCampaignData, PhishingCampaign } from "../types/phishingCampaign.types";
import type { Employee } from "../../employees/types/employee.types";

interface CampaignPopupProps {
    onClose: () => void;

    employees: Employee[];
    employeesLoading: boolean;

    createCampaign: (campaignData: CreateCampaignData) => Promise<PhishingCampaign>;
}

const emptyForm = {
    name: "",
    emailTemplate: "",
    landingPage: "",
    sendingProfile: "",
    senderDomain: "",
    campaignUrl: "",
    launchDate: "",
    notes: ""
};

export default function CampaignPopup({ onClose, employees, employeesLoading, createCampaign }: CampaignPopupProps) {

    const businessContext = useContext(BusinessContext);

    const [formData, setFormData] = useState(emptyForm);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [templates, setTemplates] = useState<GophishTemplate[]>([]);
    const [pages, setPages] = useState<GophishPage[]>([]);
    const [sendingProfiles, setSendingProfiles] = useState<GophishSendingProfile[]>([]);
    const [gophishLoading, setGophishLoading] = useState(false);
    const [gophishError, setGophishError] = useState<string | null>(null);

    const fetchGophishOptions = async () => {

        if (!businessContext?.businessId) return;

        try {

            setGophishLoading(true);
            setGophishError(null);

            const [templatesData, pagesData, sendingProfilesData] = await Promise.all([
                getGophishTemplates(businessContext.businessId),
                getGophishPages(businessContext.businessId),
                getGophishSendingProfiles(businessContext.businessId)
            ]);

            setTemplates(templatesData);
            setPages(pagesData);
            setSendingProfiles(sendingProfilesData);

        } catch (error) {

            console.error(error);

            setGophishError(
                error instanceof Error ? error.message : "Error al conectar con Gophish"
            );

        } finally {

            setGophishLoading(false);

        }
    };

    useEffect(() => {
        fetchGophishOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [businessContext?.businessId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const toggleEmployee = (employeeId: string) => {
        setSelectedEmployeeIds((current) =>
            current.includes(employeeId)
                ? current.filter((id) => id !== employeeId)
                : [...current, employeeId]
        );
    };

    const selectAll = () => setSelectedEmployeeIds(employees.map((employee) => employee._id));
    const clearAll = () => setSelectedEmployeeIds([]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (!formData.name.trim()) {
            setError("El nombre de la campaña es requerido");
            return;
        }

        if (selectedEmployeeIds.length === 0) {
            setError("Selecciona al menos un empleado como objetivo");
            return;
        }

        try {

            setLoading(true);
            setError(null);

            await createCampaign({
                ...formData,
                employeeIds: selectedEmployeeIds
            });

            onClose();

        } catch (error) {

            console.error(error);

            setError(error instanceof Error ? error.message : "Error al crear la campaña");

        } finally {

            setLoading(false);

        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-[42%] max-h-[85vh] overflow-y-auto bg-[#1A1A1A] flex flex-col p-4 gap-6"
        >
            <button onClick={onClose} type="button"><X size={14} /></button>

            <div className="flex gap-2">
                <Fish />
                <p>Lanzar campaña de phishing</p>
            </div>

            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Nombre de la campaña</p>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ej. Baseline Q1 2027" />
            </div>

            <div className="w-full flex justify-between items-center">
                <p className="text-xs text-[#959595]">Opciones cargadas en vivo desde tu servidor Gophish</p>
                <button type="button" onClick={fetchGophishOptions} className="flex items-center gap-1 text-xs text-[#959595]">
                    <RefreshCw size={12} className={gophishLoading ? "animate-spin" : ""} />
                    <span>Recargar</span>
                </button>
            </div>

            {gophishError && (
                <p className="text-xs text-red-400">
                    {gophishError} — puedes seguir creando la campaña y completar esto después.
                </p>
            )}

            <div className="w-full flex gap-3">
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Plantilla de correo</p>
                    <select name="emailTemplate" value={formData.emailTemplate} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] text-sm">
                        <option value="">Selecciona...</option>
                        {templates.map((template) => (
                            <option key={template.id} value={template.name}>{template.name}</option>
                        ))}
                    </select>
                </div>
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Landing page</p>
                    <select name="landingPage" value={formData.landingPage} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] text-sm">
                        <option value="">Selecciona...</option>
                        {pages.map((page) => (
                            <option key={page.id} value={page.name}>{page.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="w-full flex gap-3">
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Sending profile</p>
                    <select name="sendingProfile" value={formData.sendingProfile} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] text-sm">
                        <option value="">Selecciona...</option>
                        {sendingProfiles.map((profile) => (
                            <option key={profile.id} value={profile.name}>{profile.name}</option>
                        ))}
                    </select>
                </div>
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Fecha de lanzamiento</p>
                    <input type="date" name="launchDate" value={formData.launchDate} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121]" />
                </div>
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">URL pública de la landing page</p>
                <input type="text" name="campaignUrl" value={formData.campaignUrl} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="https://track.tudominio.com" />
                <p className="text-xs text-[#5c5c5c]">La URL que va en los links del correo. Requerida por Gophish para lanzar, no para guardar el borrador aquí.</p>
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Notas</p>
                <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full h-16 rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Contexto adicional sobre esta campaña" />
            </div>

            <div className="w-full flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <p className="text-sm">Empleados objetivo ({selectedEmployeeIds.length} seleccionados)</p>
                    <div className="flex gap-3 text-xs text-[#3550CB]">
                        <button type="button" onClick={selectAll}>Todos</button>
                        <button type="button" onClick={clearAll}>Ninguno</button>
                    </div>
                </div>

                {employeesLoading && (
                    <p className="text-sm text-[#959595]">Cargando nómina de la empresa...</p>
                )}

                {!employeesLoading && employees.length === 0 && (
                    <p className="text-sm text-[#959595]">
                        Esta empresa no tiene empleados cargados. Agrégalos primero desde la pestaña Empleados.
                    </p>
                )}

                {!employeesLoading && employees.length > 0 && (
                    <div className="w-full max-h-56 overflow-y-auto flex flex-col gap-1">
                        {employees.map((employee) => (
                            <label key={employee._id} className="w-full flex items-center gap-2 bg-[#212121] rounded-md px-3 py-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedEmployeeIds.includes(employee._id)}
                                    onChange={() => toggleEmployee(employee._id)}
                                />
                                <div className="flex-1">
                                    <p className="text-sm">{employee.fullName}</p>
                                    <p className="text-xs text-[#959595]">{employee.email} {employee.sector ? `· ${employee.sector}` : ""}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-center">
                <button type="submit" disabled={loading} className="w-[45%] bg-[#2F76D2] rounded-md px-2 py-1">
                    {loading ? "Creando..." : "Crear campaña"}
                </button>
            </div>

        </form>
    )
}

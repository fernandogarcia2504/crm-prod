import { useState } from "react";

import { X, Users } from "lucide-react";

import type { CreateEmployeeData, Employee, BulkCreateEmployeesResponse } from "../types/employee.types";

interface EmployeePopupProps {
    onClose: () => void;

    createEmployee: (employeeData: CreateEmployeeData) => Promise<Employee>;
    bulkCreateEmployees: (employeesData: CreateEmployeeData[]) => Promise<BulkCreateEmployeesResponse>;
}

const emptyEmployee: CreateEmployeeData = {
    fullName: "",
    position: "",
    email: "",
    sector: "",
    notes: ""
};

// Convierte lineas tipo "Nombre, Puesto, correo@cliente.com, Sector" en
// objetos CreateEmployeeData. Pensado para pegar directo desde un Excel/CSV.
const parseBulkText = (text: string): CreateEmployeeData[] => {

    return text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => {

            const [fullName = "", position = "", email = "", sector = ""] =
                line.split(",").map((value) => value.trim());

            return { fullName, position, email, sector };

        })
        .filter((row) => row.fullName && row.email);
};

export default function EmployeePopup({ onClose, createEmployee, bulkCreateEmployees }: EmployeePopupProps) {

    const [mode, setMode] = useState<"individual" | "masivo">("individual");

    const [formData, setFormData] = useState<CreateEmployeeData>(emptyEmployee);
    const [bulkText, setBulkText] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmitIndividual = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (!formData.fullName.trim() || !formData.email.trim()) {
            setError("El nombre completo y el correo son requeridos");
            return;
        }

        try {

            setLoading(true);
            setError(null);

            await createEmployee(formData);

            onClose();

        } catch (error) {

            console.error(error);

            setError(error instanceof Error ? error.message : "Error al crear el empleado");

        } finally {

            setLoading(false);

        }
    };

    const handleSubmitBulk = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const rows = parseBulkText(bulkText);

        if (rows.length === 0) {
            setError("Pega al menos una fila con nombre y correo");
            return;
        }

        try {

            setLoading(true);
            setError(null);
            setSummary(null);

            const result = await bulkCreateEmployees(rows);

            setSummary(result.message);

            if (result.skipped.length === 0) {
                onClose();
            }

        } catch (error) {

            console.error(error);

            setError(error instanceof Error ? error.message : "Error al cargar los empleados");

        } finally {

            setLoading(false);

        }
    };

    return (
        <form
            onSubmit={mode === "individual" ? handleSubmitIndividual : handleSubmitBulk}
            onClick={(e) => e.stopPropagation()}
            className="w-[38%] max-h-[85vh] overflow-y-auto bg-[#1A1A1A] flex flex-col p-4 gap-6"
        >
            <button onClick={onClose} type="button"><X size={14} /></button>

            <div className="flex gap-2">
                <Users />
                <p>Agregar empleado(s) al alcance</p>
            </div>

            <div className="w-full flex gap-2 bg-[#212121] rounded-md p-1">
                <button
                    type="button"
                    onClick={() => setMode("individual")}
                    className={`w-1/2 rounded-md py-1 text-sm ${mode === "individual" ? "bg-[#2F76D2]" : ""}`}
                >
                    Individual
                </button>
                <button
                    type="button"
                    onClick={() => setMode("masivo")}
                    className={`w-1/2 rounded-md py-1 text-sm ${mode === "masivo" ? "bg-[#2F76D2]" : ""}`}
                >
                    Carga masiva
                </button>
            </div>

            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}

            {summary && (
                <p className="text-sm text-[#959595]">{summary}</p>
            )}

            {mode === "individual" && (
                <>
                    <div className="w-full flex flex-col gap-3">
                        <p className="text-sm">Nombre completo</p>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ej. Ana Torres" />
                    </div>

                    <div className="w-full flex gap-3">
                        <div className="w-1/2 flex flex-col gap-3">
                            <p className="text-sm">Puesto</p>
                            <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ej. Analista" />
                        </div>
                        <div className="w-1/2 flex flex-col gap-3">
                            <p className="text-sm">Sector</p>
                            <input type="text" name="sector" value={formData.sector} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ej. Finanzas" />
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                        <p className="text-sm">Correo</p>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="empleado@cliente.com" />
                    </div>

                    <p className="text-xs text-[#5c5c5c]">
                        Al crear el empleado se generan automáticamente sus credenciales del curso de concientización.
                    </p>
                </>
            )}

            {mode === "masivo" && (
                <>
                    <div className="w-full flex flex-col gap-3">
                        <p className="text-sm">Pega la lista (una fila por empleado)</p>
                        <textarea
                            value={bulkText}
                            onChange={(e) => setBulkText(e.target.value)}
                            className="w-full h-40 rounded-md px-3 py-2 bg-[#212121] placeholder:text-sm font-mono text-sm"
                            placeholder={"Ana Torres, Analista, ana@cliente.com, Finanzas\nLuis Pérez, Gerente, luis@cliente.com, Marketing"}
                        />
                    </div>

                    <p className="text-xs text-[#5c5c5c]">
                        Formato por línea: nombre completo, puesto, correo, sector. Se generan credenciales del curso para cada uno.
                    </p>
                </>
            )}

            <div className="flex justify-center">
                <button type="submit" disabled={loading} className="w-[45%] bg-[#2F76D2] rounded-md px-2 py-1">
                    {loading ? "Guardando..." : "Guardar"}
                </button>
            </div>

        </form>
    )
}

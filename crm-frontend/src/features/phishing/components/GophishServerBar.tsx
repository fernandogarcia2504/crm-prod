import { useContext, useState } from "react";

import { ExternalLink, Pencil, Check, X } from "lucide-react";

import { BusinessContext } from "../../../app/context/BusinessContext";

export default function GophishServerBar() {

    const businessContext = useContext(BusinessContext);

    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(businessContext?.business?.gophishUrl ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentUrl = businessContext?.business?.gophishUrl;

    const startEditing = () => {
        setValue(currentUrl ?? "");
        setError(null);
        setIsEditing(true);
    };

    const handleSave = async () => {

        if (!businessContext) return;

        if (!value.trim()) {
            setError("Ingresa la URL de tu servidor Gophish");
            return;
        }

        try {

            setSaving(true);
            setError(null);

            await businessContext.updateGophishUrl(value.trim());

            setIsEditing(false);

        } catch (error) {

            console.error(error);

            setError(error instanceof Error ? error.message : "Error al guardar la URL");

        } finally {

            setSaving(false);

        }
    };

    if (isEditing) {
        return (
            <div className="w-full flex items-center gap-2 bg-[#171717] rounded-md px-4 py-2 mt-6">
                <p className="text-sm text-[#959595] whitespace-nowrap">Servidor Gophish</p>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="https://192.168.100.108:3333"
                    className="flex-1 bg-[#212121] rounded-md px-3 py-1 text-sm"
                    autoFocus
                />
                <button type="button" onClick={handleSave} disabled={saving} title="Guardar">
                    <Check size={16} />
                </button>
                <button type="button" onClick={() => setIsEditing(false)} title="Cancelar">
                    <X size={16} />
                </button>
                {error && <p className="text-xs text-red-400 whitespace-nowrap">{error}</p>}
            </div>
        );
    }

    return (
        <div className="w-full flex items-center justify-between bg-[#171717] rounded-md px-4 py-2 mt-6">
            {currentUrl ? (
                <a
                    href={currentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-[#2F76D2]"
                >
                    <span>Abrir Gophish</span>
                    <ExternalLink size={14} />
                    <span className="text-[#5c5c5c]">{currentUrl}</span>
                </a>
            ) : (
                <p className="text-sm text-[#959595]">Aún no has configurado la URL de tu servidor Gophish</p>
            )}

            <button type="button" onClick={startEditing} className="flex items-center gap-1 text-sm text-[#959595]">
                <Pencil size={14} />
                <span>{currentUrl ? "Editar" : "Configurar"}</span>
            </button>
        </div>
    )
}

import { useState } from "react";

import { X, Plus } from "lucide-react";

import type { CreateModuleData, Course } from "../types/course.types";

interface AddModulePopupProps {
    onClose: () => void;
    nextOrder: number;
    addModule: (moduleData: CreateModuleData) => Promise<Course>;
}

export default function AddModulePopup({ onClose, nextOrder, addModule }: AddModulePopupProps) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [passingScore, setPassingScore] = useState(80);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (!title.trim()) {
            setError("El título del módulo es requerido");
            return;
        }

        try {

            setLoading(true);
            setError(null);

            await addModule({
                title,
                description,
                order: nextOrder,
                passingScore,
                quiz: []
            });

            onClose();

        } catch (error) {

            console.error(error);

            setError(error instanceof Error ? error.message : "Error al agregar el módulo");

        } finally {

            setLoading(false);

        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-[36%] bg-[#1A1A1A] flex flex-col p-4 gap-6 rounded-md"
        >
            <button onClick={onClose} type="button"><X size={14} /></button>

            <div className="flex gap-2 items-center">
                <Plus size={18} />
                <p>Agregar módulo</p>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Título</p>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm"
                    placeholder="Ej. Cómo identificar un correo de phishing"
                />
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Descripción</p>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-20 rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm"
                />
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Puntaje mínimo del quiz (%)</p>
                <input
                    type="number"
                    min={0}
                    max={100}
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                    className="w-full rounded-md px-3 py-1 bg-[#212121]"
                />
            </div>

            <p className="text-xs text-[#5c5c5c]">
                El PDF, video y las preguntas del quiz se agregan después, editando el módulo ya creado.
            </p>

            <div className="flex justify-center">
                <button type="submit" disabled={loading} className="w-[45%] bg-[#2F76D2] rounded-md px-2 py-1">
                    {loading ? "Agregando..." : "Agregar módulo"}
                </button>
            </div>

        </form>
    );
}

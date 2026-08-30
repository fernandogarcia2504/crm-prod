import { useState } from "react";

import { X, GraduationCap } from "lucide-react";

import type { CreateCourseData, Course } from "../types/course.types";

interface CreateCoursePopupProps {
    onClose: () => void;
    createCourse: (courseData: CreateCourseData) => Promise<Course>;
}

export default function CreateCoursePopup({ onClose, createCourse }: CreateCoursePopupProps) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (!title.trim()) {
            setError("El título del curso es requerido");
            return;
        }

        try {

            setLoading(true);
            setError(null);

            await createCourse({ title, description, active: true });

            onClose();

        } catch (error) {

            console.error(error);

            setError(error instanceof Error ? error.message : "Error al crear el curso");

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
                <GraduationCap size={18} />
                <p>Crear curso de concientización</p>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Título</p>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm"
                    placeholder="Ej. Curso de Concientización en Ciberseguridad"
                />
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Descripción</p>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-20 rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm"
                    placeholder="De qué trata el curso, a quién va dirigido, etc."
                />
            </div>

            <p className="text-xs text-[#5c5c5c]">
                Solo se necesita un curso: una vez creado, todos los empleados nuevos se enrolan automáticamente. Los módulos se agregan después.
            </p>

            <div className="flex justify-center">
                <button type="submit" disabled={loading} className="w-[45%] bg-[#2F76D2] rounded-md px-2 py-1">
                    {loading ? "Creando..." : "Crear curso"}
                </button>
            </div>

        </form>
    );
}

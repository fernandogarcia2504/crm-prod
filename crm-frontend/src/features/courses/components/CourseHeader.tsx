import { useState } from "react";

import { Pencil, Trash2, Check, X } from "lucide-react";

import type { Course, UpdateCourseData } from "../types/course.types";

interface CourseHeaderProps {
    course: Course;
    updateCourse: (data: UpdateCourseData) => Promise<Course>;
    deleteCourse: () => Promise<void>;
}

export default function CourseHeader({ course, updateCourse, deleteCourse }: CourseHeaderProps) {

    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(course.title);
    const [description, setDescription] = useState(course.description ?? "");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startEditing = () => {
        setTitle(course.title);
        setDescription(course.description ?? "");
        setEditing(true);
    };

    const handleSave = async () => {

        if (!title.trim()) {
            setError("El título es requerido");
            return;
        }

        try {
            setSaving(true);
            setError(null);
            await updateCourse({ title, description });
            setEditing(false);
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : "Error al actualizar el curso");
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async () => {
        try {
            await updateCourse({ active: !course.active });
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : "Error al actualizar el curso");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`¿Eliminar el curso "${course.title}"? Esto lo quita también de todos los empleados enrolados.`)) return;
        await deleteCourse();
    };

    return (
        <div className="w-full bg-[#1A1A1A] rounded-md p-4 flex flex-col gap-3">

            {error && <p className="text-sm text-red-400">{error}</p>}

            {!editing && (
                <div className="w-full flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <p className="text-lg">{course.title}</p>
                            <span
                                onClick={toggleActive}
                                className={`text-xs px-2 py-0.5 rounded-full cursor-pointer ${course.active ? "bg-[#1e3a2f] text-green-400" : "bg-[#3a1e1e] text-red-400"}`}
                                title="Click para activar/desactivar"
                            >
                                {course.active ? "Activo" : "Inactivo"}
                            </span>
                        </div>
                        {course.description && (
                            <p className="text-sm text-[#959595] mt-2">{course.description}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button title="Editar" onClick={startEditing}>
                            <Pencil size={14} className="text-[#959595] hover:text-[#ECECEC] transition-colors" />
                        </button>
                        <button title="Eliminar curso" onClick={handleDelete}>
                            <Trash2 size={14} className="text-[#959595] hover:text-red-400 transition-colors" />
                        </button>
                    </div>
                </div>
            )}

            {editing && (
                <div className="w-full flex flex-col gap-3">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-md px-3 py-1 bg-[#212121] text-sm"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full h-16 rounded-md px-3 py-1 bg-[#212121] text-sm"
                    />
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-1 bg-[#2F76D2] rounded-md px-3 py-1 text-sm"
                        >
                            <Check size={13} />
                            {saving ? "Guardando..." : "Guardar"}
                        </button>
                        <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-sm text-[#959595]">
                            <X size={13} /> Cancelar
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

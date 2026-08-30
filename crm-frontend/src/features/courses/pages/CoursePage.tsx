import { useState } from "react";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import CreateButton from "../../../components/ui/buttons/CreateButton";
import CreateCoursePopup from "../components/CreateCoursePopup";
import AddModulePopup from "../components/AddModulePopup";
import CourseHeader from "../components/CourseHeader";
import ModuleEditor from "../components/ModuleEditor";

import { useCourse } from "../hooks/useCourse";

export default function CoursePage() {

    const businessId = localStorage.getItem("businessId");

    const {
        course,
        loading,
        error,
        createCourse,
        updateCourse,
        deleteCourse,
        addModule,
        updateModule,
        deleteModule,
        uploadModulePdf,
        uploadModuleVideo
    } = useCourse(businessId);

    const [isOpenCreatePopup, setIsOpenCreatePopup] = useState(false);
    const [isOpenAddModulePopup, setIsOpenAddModulePopup] = useState(false);

    const sortedModules = course
        ? [...course.modules].sort((a, b) => a.order - b.order)
        : [];

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col pb-16">

            {loading && (
                <p className="mt-12 text-[#959595]">Cargando curso...</p>
            )}

            {error && (
                <p className="mt-12 text-red-400">{error}</p>
            )}

            {!loading && !error && !course && (
                <div className="w-full flex flex-col items-center gap-4 mt-16">
                    <p className="text-[#959595] text-center max-w-md">
                        Todavía no has creado el curso de concientización de seguridad.
                        Solo necesitas uno: una vez creado, los empleados nuevos se
                        enrolan automáticamente al darlos de alta.
                    </p>
                    <CreateButton title="Crear curso" onClick={() => setIsOpenCreatePopup(true)} />
                </div>
            )}

            {!loading && !error && course && (
                <div className="w-full flex flex-col gap-6 mt-12">

                    <CourseHeader course={course} updateCourse={updateCourse} deleteCourse={deleteCourse} />

                    <div className="w-full flex justify-between items-center">
                        <p className="text-sm text-[#959595]">
                            {sortedModules.length} módulo{sortedModules.length !== 1 ? "s" : ""}
                        </p>
                        <button
                            onClick={() => setIsOpenAddModulePopup(true)}
                            className="flex items-center gap-2 bg-[#232323] hover:bg-[#2F2F2F] py-2 px-3 rounded-md shadow-lg transition duration-300 text-sm"
                        >
                            <Plus size={14} /> Agregar módulo
                        </button>
                    </div>

                    {sortedModules.length === 0 && (
                        <p className="text-sm text-[#5c5c5c]">
                            Este curso todavía no tiene módulos. Agrega el primero para empezar a construir el contenido.
                        </p>
                    )}

                    <div className="w-full flex flex-col gap-2">
                        {sortedModules.map((module) => (
                            <ModuleEditor
                                key={module._id}
                                module={module}
                                onUpdate={updateModule}
                                onDelete={deleteModule}
                                onUploadPdf={uploadModulePdf}
                                onUploadVideo={uploadModuleVideo}
                            />
                        ))}
                    </div>

                </div>
            )}

            {isOpenCreatePopup && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    onClick={() => setIsOpenCreatePopup(false)}
                >
                    <CreateCoursePopup onClose={() => setIsOpenCreatePopup(false)} createCourse={createCourse} />
                </div>
            )}

            {isOpenAddModulePopup && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    onClick={() => setIsOpenAddModulePopup(false)}
                >
                    <AddModulePopup
                        onClose={() => setIsOpenAddModulePopup(false)}
                        nextOrder={sortedModules.length}
                        addModule={addModule}
                    />
                </div>
            )}

        </motion.div>
    );
}

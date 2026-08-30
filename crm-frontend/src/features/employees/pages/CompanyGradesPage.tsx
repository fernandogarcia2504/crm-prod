import { useContext, useState } from "react";
import { useParams } from "react-router-dom";

import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

import ModuleGradesList from "../components/ModuleGradesList";

import { useEmployees } from "../hooks/useEmployees";
import { useCourse } from "../../courses/hooks/useCourse";

import { BusinessContext } from "../../../app/context/BusinessContext";

import type { Employee } from "../types/employee.types";

// Promedio de las calificaciones de quiz que el empleado ya intento.
// Modulos sin quiz (solo lectura/video) no cuentan para este promedio.
const averageQuizScore = (employee: Employee): number | null => {

    const scores = employee.courseAccount.moduleProgress
        .map((entry) => entry.quizScore)
        .filter((score): score is number => score !== null && score !== undefined);

    if (scores.length === 0) return null;

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

export default function CompanyGradesPage() {

    const { companyId } = useParams();
    const businessContext = useContext(BusinessContext);

    const { employees, loading, error } = useEmployees(companyId ?? null);
    const { course, loading: courseLoading } = useCourse(businessContext?.businessId ?? null);

    const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(null);

    const toggleExpanded = (employeeId: string) => {
        setExpandedEmployeeId((current) => (current === employeeId ? null : employeeId));
    };

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col pb-16">

            <div className="w-full flex flex-col mt-12">
                <p className="text-lg">Calificaciones</p>
                {!courseLoading && (
                    <p className="text-sm text-[#959595] mt-1">
                        {course ? course.title : "Todavía no hay un curso creado en este negocio."}
                    </p>
                )}
            </div>

            {loading && (
                <p className="mt-8 text-[#959595]">Cargando empleados...</p>
            )}

            {error && (
                <p className="mt-8 text-red-400">{error}</p>
            )}

            {!loading && !error && employees.length === 0 && (
                <p className="mt-8 text-[#959595]">
                    Esta empresa todavía no tiene empleados cargados.
                </p>
            )}

            {!loading && !error && employees.length > 0 && (
                <div className="w-full flex flex-col gap-2 mt-8">

                    <div className="w-full flex bg-[#171717] rounded-t-md px-4 py-2 text-sm text-[#959595]">
                        <p className="w-[26%]">Nombre</p>
                        <p className="w-[16%]">Sector</p>
                        <p className="w-[18%]">Estado</p>
                        <p className="w-[18%]">Progreso</p>
                        <p className="w-[14%]">Promedio de quiz</p>
                        <p className="w-[8%] text-right">Detalle</p>
                    </div>

                    {employees.map((employee) => {

                        const average = averageQuizScore(employee);

                        return (
                            <div key={employee._id} className="w-full flex flex-col bg-[#1A1A1A] rounded-md">
                                <div className="w-full flex items-center px-4 py-3">
                                    <p className="w-[26%] text-sm">{employee.fullName}</p>
                                    <p className="w-[16%] text-sm text-[#959595]">{employee.sector || "—"}</p>
                                    <p className="w-[18%] text-sm">
                                        {!employee.courseAccount.course
                                            ? "Sin curso"
                                            : employee.courseAccount.completed
                                                ? "Completado"
                                                : employee.courseAccount.enrolled
                                                    ? "En curso"
                                                    : "Sin enrolar"}
                                    </p>
                                    <p className="w-[18%] text-sm text-[#959595]">{employee.courseAccount.progress}%</p>
                                    <p className="w-[14%] text-sm text-[#959595]">
                                        {average !== null ? `${average}%` : "—"}
                                    </p>
                                    <div className="w-[8%] flex justify-end">
                                        <button title="Ver detalle por módulo" onClick={() => toggleExpanded(employee._id)}>
                                            {expandedEmployeeId === employee._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </button>
                                    </div>
                                </div>

                                {expandedEmployeeId === employee._id && (
                                    <div className="border-t border-[#2b2b2b]">
                                        <ModuleGradesList employee={employee} modules={course?.modules ?? []} />
                                    </div>
                                )}
                            </div>
                        );

                    })}

                </div>
            )}

        </motion.div>
    );
}

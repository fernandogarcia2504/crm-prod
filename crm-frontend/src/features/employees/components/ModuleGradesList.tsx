import { Check, X, Minus } from "lucide-react";

import type { Employee } from "../types/employee.types";
import type { CourseModule } from "../../courses/types/course.types";

interface ModuleGradesListProps {
    employee: Employee;
    modules: CourseModule[];
}

export default function ModuleGradesList({ employee, modules }: ModuleGradesListProps) {

    if (!employee.courseAccount.course) {
        return (
            <p className="text-sm text-[#5c5c5c] px-4 py-3">
                Este empleado todavía no tiene un curso asignado.
            </p>
        );
    }

    if (modules.length === 0) {
        return (
            <p className="text-sm text-[#5c5c5c] px-4 py-3">
                El curso asignado todavía no tiene módulos.
            </p>
        );
    }

    const progressByModule = new Map(
        employee.courseAccount.moduleProgress.map((entry) => [entry.module, entry])
    );

    return (
        <div className="w-full flex flex-col gap-1 px-4 py-3">
            {[...modules].sort((a, b) => a.order - b.order).map((module) => {

                const entry = progressByModule.get(module._id);
                const hasQuiz = module.quiz && module.quiz.length > 0;
                const passed = hasQuiz && entry?.quizScore !== null && entry?.quizScore !== undefined
                    ? entry.quizScore >= module.passingScore
                    : null;

                return (
                    <div key={module._id} className="w-full flex items-center justify-between bg-[#212121] rounded-md px-3 py-2">
                        <p className="text-sm">{module.title}</p>

                        <div className="flex items-center gap-2">
                            {hasQuiz ? (
                                entry?.quizScore !== null && entry?.quizScore !== undefined ? (
                                    <span className={`text-xs flex items-center gap-1 ${passed ? "text-green-400" : "text-red-400"}`}>
                                        {passed ? <Check size={12} /> : <X size={12} />}
                                        {entry.quizScore}%
                                    </span>
                                ) : (
                                    <span className="text-xs text-[#5c5c5c] flex items-center gap-1">
                                        <Minus size={12} /> Sin intentar
                                    </span>
                                )
                            ) : (
                                <span className={`text-xs flex items-center gap-1 ${entry?.completed ? "text-green-400" : "text-[#5c5c5c]"}`}>
                                    {entry?.completed ? <Check size={12} /> : <Minus size={12} />}
                                    {entry?.completed ? "Completado" : "Pendiente"}
                                </span>
                            )}
                        </div>
                    </div>
                );

            })}
        </div>
    );
}

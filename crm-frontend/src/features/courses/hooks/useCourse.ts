import { useEffect, useState } from "react";

import {
    getCourses,
    getCourse,
    createCourse as createCourseService,
    updateCourse as updateCourseService,
    deleteCourse as deleteCourseService,
    addModule as addModuleService,
    updateModule as updateModuleService,
    deleteModule as deleteModuleService,
    uploadModulePdf as uploadModulePdfService,
    uploadModuleVideo as uploadModuleVideoService
} from "../services/courseService";

import type {
    Course,
    CreateCourseData,
    UpdateCourseData,
    CreateModuleData,
    UpdateModuleData
} from "../types/course.types";

// Este negocio solo tiene un curso, asi que el hook no expone una lista:
// resuelve directo a "el" curso (o null si todavia no existe ninguno).
export function useCourse(businessId: string | null) {

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCourse = async () => {

        if (!businessId) {
            setCourse(null);
            return;
        }

        try {

            setLoading(true);
            setError(null);

            const courses = await getCourses(businessId);

            if (courses.length === 0) {
                setCourse(null);
                return;
            }

            // getCourses omite las respuestas correctas del quiz a
            // proposito; para editar se necesita el detalle completo
            const fullCourse = await getCourse(businessId, courses[0]._id);
            setCourse(fullCourse);

        } catch (error) {

            console.error(error);

            setError(
                error instanceof Error ? error.message : "Error al obtener el curso"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchCourse();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [businessId]);

    const createCourse = async (courseData: CreateCourseData) => {

        if (!businessId) {
            throw new Error("No existe un negocio seleccionado");
        }

        const newCourse = await createCourseService(businessId, courseData);
        setCourse(newCourse);

        return newCourse;
    };

    const updateCourse = async (courseData: UpdateCourseData) => {

        if (!businessId || !course) {
            throw new Error("No existe un curso para actualizar");
        }

        const updatedCourse = await updateCourseService(businessId, course._id, courseData);
        setCourse(updatedCourse);

        return updatedCourse;
    };

    const deleteCourse = async () => {

        if (!businessId || !course) {
            throw new Error("No existe un curso para eliminar");
        }

        await deleteCourseService(businessId, course._id);
        setCourse(null);
    };

    const addModule = async (moduleData: CreateModuleData) => {

        if (!businessId || !course) {
            throw new Error("No existe un curso al cual agregar el modulo");
        }

        const updatedCourse = await addModuleService(businessId, course._id, moduleData);
        setCourse(updatedCourse);

        return updatedCourse;
    };

    const updateModule = async (moduleId: string, moduleData: UpdateModuleData) => {

        if (!businessId || !course) {
            throw new Error("No existe un curso");
        }

        const updatedCourse = await updateModuleService(businessId, course._id, moduleId, moduleData);
        setCourse(updatedCourse);

        return updatedCourse;
    };

    const deleteModule = async (moduleId: string) => {

        if (!businessId || !course) {
            throw new Error("No existe un curso");
        }

        const updatedCourse = await deleteModuleService(businessId, course._id, moduleId);
        setCourse(updatedCourse);

        return updatedCourse;
    };

    const uploadModulePdf = async (moduleId: string, file: File) => {

        if (!businessId || !course) {
            throw new Error("No existe un curso");
        }

        const updatedCourse = await uploadModulePdfService(businessId, course._id, moduleId, file);
        setCourse(updatedCourse);

        return updatedCourse;
    };

    const uploadModuleVideo = async (moduleId: string, file: File) => {

        if (!businessId || !course) {
            throw new Error("No existe un curso");
        }

        const updatedCourse = await uploadModuleVideoService(businessId, course._id, moduleId, file);
        setCourse(updatedCourse);

        return updatedCourse;
    };

    return {
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
    };

}

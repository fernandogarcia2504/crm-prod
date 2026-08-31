import type {
    Course,
    CreateCourseData,
    UpdateCourseData,
    CreateModuleData,
    UpdateModuleData,
    GetCoursesResponse,
    GetCourseResponse,
    CourseResponse,
    DeleteCourseResponse
} from "../types/course.types";

const API_URL = "https://crmprod-70ae5fa5478a.herokuapp.com/api/courses";

const authHeaders = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token")}`
});

export const getCourses = async (businessId: string): Promise<Course[]> => {

    const response = await fetch(`${API_URL}/${businessId}`, {
        headers: authHeaders()
    });

    const data: GetCoursesResponse = await response.json();

    if (!response.ok) {
        throw new Error("Error al obtener los cursos");
    }

    return data.courses;
};

export const getCourse = async (businessId: string, courseId: string): Promise<Course> => {

    const response = await fetch(`${API_URL}/${businessId}/courses/${courseId}`, {
        headers: authHeaders()
    });

    const data: GetCourseResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al obtener el curso");
    }

    return data.course;
};

export const createCourse = async (
    businessId: string,
    courseData: CreateCourseData
): Promise<Course> => {

    const response = await fetch(`${API_URL}/${businessId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders()
        },
        body: JSON.stringify(courseData)
    });

    const data: CourseResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al crear el curso");
    }

    return data.course;
};

export const updateCourse = async (
    businessId: string,
    courseId: string,
    courseData: UpdateCourseData
): Promise<Course> => {

    const response = await fetch(`${API_URL}/${businessId}/courses/${courseId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders()
        },
        body: JSON.stringify(courseData)
    });

    const data: CourseResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar el curso");
    }

    return data.course;
};

export const deleteCourse = async (
    businessId: string,
    courseId: string
): Promise<DeleteCourseResponse> => {

    const response = await fetch(`${API_URL}/${businessId}/courses/${courseId}`, {
        method: "DELETE",
        headers: authHeaders()
    });

    const data: DeleteCourseResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al eliminar el curso");
    }

    return data;
};

export const addModule = async (
    businessId: string,
    courseId: string,
    moduleData: CreateModuleData
): Promise<Course> => {

    const response = await fetch(`${API_URL}/${businessId}/courses/${courseId}/modules`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders()
        },
        body: JSON.stringify(moduleData)
    });

    const data: CourseResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al agregar el modulo");
    }

    return data.course;
};

export const updateModule = async (
    businessId: string,
    courseId: string,
    moduleId: string,
    moduleData: UpdateModuleData
): Promise<Course> => {

    const response = await fetch(`${API_URL}/${businessId}/courses/${courseId}/modules/${moduleId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders()
        },
        body: JSON.stringify(moduleData)
    });

    const data: CourseResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar el modulo");
    }

    return data.course;
};

export const deleteModule = async (
    businessId: string,
    courseId: string,
    moduleId: string
): Promise<Course> => {

    const response = await fetch(`${API_URL}/${businessId}/courses/${courseId}/modules/${moduleId}`, {
        method: "DELETE",
        headers: authHeaders()
    });

    const data: CourseResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al eliminar el modulo");
    }

    return data.course;
};

export const uploadModulePdf = async (
    businessId: string,
    courseId: string,
    moduleId: string,
    file: File
): Promise<Course> => {

    const formData = new FormData();
    formData.append("file", file);

    // Sin "Content-Type": el navegador arma el boundary de multipart solo.
    const response = await fetch(`${API_URL}/${businessId}/courses/${courseId}/modules/${moduleId}/pdf`, {
        method: "POST",
        headers: authHeaders(),
        body: formData
    });

    const data: CourseResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al subir el PDF");
    }

    return data.course;
};

export const uploadModuleVideo = async (
    businessId: string,
    courseId: string,
    moduleId: string,
    file: File
): Promise<Course> => {

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/${businessId}/courses/${courseId}/modules/${moduleId}/video`, {
        method: "POST",
        headers: authHeaders(),
        body: formData
    });

    const data: CourseResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al subir el video");
    }

    return data.course;
};

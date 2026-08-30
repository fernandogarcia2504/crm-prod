export interface QuizQuestion {
    question: string;
    options: string[];
    // Solo viene presente cuando se pide el curso completo para edicion
    // (getCourse). En getCourses (listado) se omite a proposito.
    correctIndex?: number;
}

export interface CourseFile {
    s3Key?: string;
    s3Bucket?: string;
    originalName?: string;
}

export interface CourseVideo extends CourseFile {
    externalUrl?: string;
}

export interface CourseModule {
    _id: string;
    title: string;
    order: number;
    description?: string;
    pdf?: CourseFile;
    video?: CourseVideo;
    quiz: QuizQuestion[];
    passingScore: number;
}

export interface Course {
    _id: string;
    business: string;
    title: string;
    description?: string;
    active: boolean;
    modules: CourseModule[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateCourseData {
    title: string;
    description?: string;
    active?: boolean;
}

export interface UpdateCourseData {
    title?: string;
    description?: string;
    active?: boolean;
}

export interface CreateModuleData {
    title: string;
    description?: string;
    order?: number;
    quiz?: QuizQuestion[];
    passingScore?: number;
}

export interface UpdateModuleData {
    title?: string;
    description?: string;
    order?: number;
    quiz?: QuizQuestion[];
    passingScore?: number;
    videoExternalUrl?: string;
}

export interface GetCoursesResponse {
    courses: Course[];
}

export interface GetCourseResponse {
    message?: string;
    course: Course;
}

export interface CourseResponse {
    message: string;
    course: Course;
}

export interface DeleteCourseResponse {
    message: string;
}

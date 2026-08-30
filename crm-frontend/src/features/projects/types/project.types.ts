export type TaskStatus = "Pendiente" | "En progreso" | "Completado";

export interface RelatedModel {
    _id: string;
    name: string;
}

export interface ChecklistTask {
    _id: string;
    task: string;
    status: TaskStatus;
    completed: boolean;
    completedAt: string | null;
}

export interface ProjectPhase {
    _id: string;
    name: string;
    order: number;
    status: string;
    startedAt: string | null;
    finishedAt: string | null;
    checklist: ChecklistTask[];
}

export interface ProjectDeliverable {
    _id: string;
    name: string;
    completed: boolean;
    version: number;
    deliveredAt: string | null;
}

export interface ProjectAsset {
    _id: string;
    name: string;
    ip: string;
    hostname: string;
    type: string;
    operatingSystem: string;
    criticality: string;
    comments: string;
}

export interface ProjectScope {
    domains: string[];
    subdomains: string[];
    ips: string[];
    applications: string[];
    apis: string[];
    exclusions: string[];
    allowedHours: string;
    technicalContact: string;
}

export interface ProjectTimelineEntry {
    _id: string;
    title: string;
    description: string;
    user: string;
    createdAt: string;
}

export interface Project {
    _id: string;
    business: string | RelatedModel | null;
    company: string | RelatedModel | null;
    opportunity: string | (RelatedModel & { stage?: string }) | null;
    serviceTemplate: string | (RelatedModel & { description?: string }) | null;
    name: string;
    status: "Planeacion" | "Ejecucion" | "Cierre" | "Cerrado";
    manager?: string;
    startDate: string | null;
    dueDate: string | null;
    deliveryDate: string | null;
    scope: ProjectScope;
    assets: ProjectAsset[];
    phases: ProjectPhase[];
    deliverables: ProjectDeliverable[];
    timeline: ProjectTimelineEntry[];
    progress: number;
    createdAt: string;
    updatedAt: string;
}

export interface GetProjectsResponse {
    projects: Project[];
}

export interface GetProjectResponse {
    project: Project;
}

export interface UpdateTaskStatusResponse {
    message: string;
    project: Project;
}

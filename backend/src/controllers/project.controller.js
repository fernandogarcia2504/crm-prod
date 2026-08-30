import Company from "../models/company.model.js";
import Project from "../models/project.model.js";

const TASK_STATUSES = ["Pendiente", "En progreso", "Completado"];

// Determina el estado de una fase a partir del estado de sus tareas
const derivePhaseStatus = (checklist) => {

    if (!checklist.length) {
        return "Pendiente";
    }

    const completedCount = checklist.filter(
        (task) => task.status === "Completado"
    ).length;

    if (completedCount === checklist.length) {
        return "Completado";
    }

    const hasProgress = checklist.some(
        (task) => task.status !== "Pendiente"
    );

    return hasProgress ? "En progreso" : "Pendiente";
};

// Porcentaje general del proyecto: tareas completadas / tareas totales
const calculateProgress = (project) => {

    const allTasks = project.phases.flatMap((phase) => phase.checklist);

    if (!allTasks.length) {
        return 0;
    }

    const completedTasks = allTasks.filter(
        (task) => task.status === "Completado"
    ).length;

    return Math.round((completedTasks / allTasks.length) * 100);
};

const serializeProject = (project) => ({
    ...project.toObject(),
    progress: calculateProgress(project)
});


// GET TODOS LOS PROYECTOS DE UNA EMPRESA
export const getProjects = async (req, res) => {

    try {

        const { companyId } = req.params;

        const company = await Company.findById(companyId);

        if (!company) {

            return res.status(404).json({
                message: "El cliente no existe"
            });

        }

        const projects = await Project
            .find({ company: companyId })
            .populate("business", "name")
            .populate("serviceTemplate", "name")
            .populate("opportunity", "title")
            .sort({ createdAt: -1 });

        return res.status(200).json({

            projects: projects.map(serializeProject)

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener los proyectos"
        });

    }

};


// GET UN PROYECTO
export const getProject = async (req, res) => {

    try {

        const { projectId } = req.params;

        const project = await Project
            .findById(projectId)
            .populate("business", "name")
            .populate("company", "name")
            .populate("serviceTemplate", "name description")
            .populate("opportunity", "title stage");

        if (!project) {

            return res.status(404).json({
                message: "El proyecto no existe"
            });

        }

        return res.status(200).json({

            project: serializeProject(project)

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener el proyecto"
        });

    }

};


// ACTUALIZAR EL ESTADO DE UNA TAREA (drag and drop del tablero por fase)
export const updateTaskStatus = async (req, res) => {

    try {

        const { projectId, phaseId, taskId } = req.params;
        const { status } = req.body;

        if (!TASK_STATUSES.includes(status)) {

            return res.status(400).json({
                message: "El estado de la tarea no es valido"
            });

        }

        const project = await Project.findById(projectId);

        if (!project) {

            return res.status(404).json({
                message: "El proyecto no existe"
            });

        }

        const phase = project.phases.id(phaseId);

        if (!phase) {

            return res.status(404).json({
                message: "La fase no existe"
            });

        }

        const task = phase.checklist.id(taskId);

        if (!task) {

            return res.status(404).json({
                message: "La tarea no existe"
            });

        }

        task.status = status;
        task.completed = status === "Completado";
        task.completedAt = status === "Completado" ? new Date() : null;

        phase.status = derivePhaseStatus(phase.checklist);

        if (phase.status === "En progreso" && !phase.startedAt) {
            phase.startedAt = new Date();
        }

        if (phase.status === "Completado" && !phase.finishedAt) {
            phase.finishedAt = new Date();
        }

        if (phase.status !== "Completado") {
            phase.finishedAt = null;
        }

        await project.save();

        return res.status(200).json({

            message: "Tarea actualizada exitosamente",

            project: serializeProject(project)

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al actualizar la tarea"
        });

    }

};
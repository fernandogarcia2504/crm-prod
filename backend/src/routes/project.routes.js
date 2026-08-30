import express from "express";

import { getProjects, getProject, updateTaskStatus } from "../controllers/project.controller.js";

const router = express.Router();

router.get("/:companyId", getProjects);

router.get("/:companyId/:projectId", getProject);

router.patch("/:companyId/:projectId/phases/:phaseId/checklist/:taskId", updateTaskStatus);

export default router;
import express from "express";

import { createServiceTemplate, getServiceTemplate, getServiceTemplates } from "../controllers/serviceTemplate.controller.js";

const router = express.Router();

router.post("/:businessId", createServiceTemplate);

router.get("/:businessId", getServiceTemplates)

router.get("/:businessId/templates/:serviceTemplateId", getServiceTemplate)

export default router;
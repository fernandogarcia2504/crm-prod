import express from "express";

import { createOpportunity, getOpportunities, getOpportunity, updateOpportunity } from "../controllers/opportunity.controller.js";

const router = express.Router();

router.post("/:companyId", createOpportunity);

router.get("/:companyId", getOpportunities);

router.get("/:companyId/:opportunityId", getOpportunity);

router.put("/:companyId/:opportunityId", updateOpportunity);

export default router;
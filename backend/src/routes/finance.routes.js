import express from "express";

import { getFinanceSummary } from "../controllers/finance.controller.js";

const router = express.Router();

router.get("/:businessId", getFinanceSummary);

export default router;

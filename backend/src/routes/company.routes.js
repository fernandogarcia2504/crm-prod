import express from "express";

import { createCompany, getCompanies, getCompany, deleteCompany, updateCompany } from "../controllers/company.controller.js";

const router = express.Router();

router.post("/:businessId", createCompany);

router.get("/:businessId", getCompanies);

router.get("/:businessId/companies/:companyId", getCompany);

router.put("/:businessId/companies/:companyId", updateCompany);

router.delete("/:businessId/companies/:companyId", deleteCompany);

export default router;
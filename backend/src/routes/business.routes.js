import express from "express";

import { createBusiness, getBusiness, getBusinesses, updateBusiness, deleteBusiness } from "../controllers/business.controller.js";

const router = express.Router();

router.post("/", createBusiness);

router.get("/", getBusinesses);

router.get("/:id", getBusiness);

router.put("/:id", updateBusiness);

router.delete("/:id", deleteBusiness);

export default router;
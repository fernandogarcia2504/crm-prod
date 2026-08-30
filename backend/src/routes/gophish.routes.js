import express from "express";

import { getTemplates, getPages, getSendingProfiles } from "../controllers/gophish.controller.js";

const router = express.Router();

router.get("/:businessId/templates", getTemplates);

router.get("/:businessId/pages", getPages);

router.get("/:businessId/sending-profiles", getSendingProfiles);

export default router;
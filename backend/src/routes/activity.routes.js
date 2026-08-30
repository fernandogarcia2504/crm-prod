import express from "express";

import { createActivity, getActivity, getOpportunityActivities } from "../controllers/activity.controller.js";

const router = express.Router();

router.post("/:opportunityId", createActivity);

router.get("/:opportunityId", getOpportunityActivities);

router.get("/:opportunityId/:activityId", getActivity);

export default router;
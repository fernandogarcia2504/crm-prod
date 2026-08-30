import express from "express";

import {
    createCampaign,
    getCampaigns,
    getCampaign,
    updateCampaign,
    updateTargetEvent,
    launchCampaignInGophish,
    syncCampaignResults,
    deleteCampaign
} from "../controllers/phishingCampaign.controller.js";

const router = express.Router();

router.get("/:projectId", getCampaigns);

router.get("/:projectId/campaigns/:campaignId", getCampaign);

router.post("/:projectId", createCampaign);

router.put("/:projectId/campaigns/:campaignId", updateCampaign);

router.patch("/:projectId/campaigns/:campaignId/targets/:targetId", updateTargetEvent);

router.post("/:projectId/campaigns/:campaignId/launch", launchCampaignInGophish);

router.post("/:projectId/campaigns/:campaignId/sync", syncCampaignResults);

router.delete("/:projectId/campaigns/:campaignId", deleteCampaign);

export default router;

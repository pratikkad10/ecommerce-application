import express from "express";
import { getActiveCampaign } from "../modules/campaigns/campaign.controller";

const router = express.Router();

router.get("/active", getActiveCampaign);

export default router;

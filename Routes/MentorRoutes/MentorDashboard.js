import express from "express";
import { fetchSingleDashboardMentorDetails } from "../../Controllers/MentorControllers/MentorDashboardController.js";

const router = express.Router();
router.post("/fetch-single-details/:id", fetchSingleDashboardMentorDetails);

export default router;

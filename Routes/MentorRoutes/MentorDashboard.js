import express from "express";
import {
  fetchSingleDashboardMentorDetails,
  InsertBankDetails,
} from "../../Controllers/MentorControllers/MentorDashboardController.js";

const router = express.Router();
router.post("/fetch-single-details/:id", fetchSingleDashboardMentorDetails);

// entrying the bank details into db

router.post("/bank-details", InsertBankDetails);

export default router;

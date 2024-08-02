import express from "express";
import {
  fetchAllMentorDetails,
  fetchSingleMentorDetails,
  MentorRegistration,
} from "../../Controllers/MentoControllers/MentorControllers.js";

const router = express.Router();
router.post("/register", MentorRegistration);

router.get("/fetch-details", fetchAllMentorDetails);

router.post("/fetch-single-details/:id", fetchSingleMentorDetails);

export default router;

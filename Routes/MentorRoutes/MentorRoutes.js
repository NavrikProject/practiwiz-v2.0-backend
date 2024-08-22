import express from "express";
import {
  fetch10MentorInHome,
  fetchAllMentorDetails,
  fetchSingleMentorDetails,
  MentorRegistration,
  test,
} from "../../Controllers/MentorControllers/MentorControllers.js";

const router = express.Router();
router.post("/register", MentorRegistration);

router.get("/fetch-details", fetchAllMentorDetails);

router.post("/fetch-single-details/:id", fetchSingleMentorDetails);

router.get("/fetch-10-mentors", fetch10MentorInHome);

router.post("/test", test);

export default router;

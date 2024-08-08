import express from "express";
import {
  fetchAllMentorDetails,
  fetchSingleMentorDetails,
  MentorRegistration,
  test,
} from "../../Controllers/MentorControllers/MentorControllers.jss";

const router = express.Router();
router.post("/register", MentorRegistration);

router.get("/fetch-details", fetchAllMentorDetails);

router.post("/fetch-single-details/:id", fetchSingleMentorDetails);

router.post("/test", test);

export default router;

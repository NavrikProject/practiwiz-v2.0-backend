import express from "express";
import {
  MenteeApprovedBookingAppointments,
  MenteeCompletedBookingAppointments,
  MenteeFeedbackSubmitHandler,
  MenteeRegistration,
} from "../../Controllers/MenteeControllers/MenteeControllers.js";

const router = express.Router();
router.post("/register", MenteeRegistration);
router.post("/appointments/upcoming", MenteeApprovedBookingAppointments);
// to get the mentee completed sessions
router.post("/appointments/completed", MenteeCompletedBookingAppointments);

// submitting the mentor feedback
router.post("/appointments/feedback/submit", MenteeFeedbackSubmitHandler);

export default router;

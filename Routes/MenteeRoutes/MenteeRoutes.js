import express from "express";
import {
  MenteeApprovedBookingAppointments,
  MenteeRegistration,
} from "../../Controllers/MenteeControllers/MenteeControllers.js";

const router = express.Router();
router.post("/register", MenteeRegistration);
router.post("/appointments/upcoming", MenteeApprovedBookingAppointments);

export default router;

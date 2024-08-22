import express from "express";
import {
  createMentorBookingAppointment,
  createMentorRazorPayOrder,
} from "../../Controllers/MentorControllers/MentorBookingController.js";

const router = express.Router();

router.post("/create-order", createMentorRazorPayOrder);
router.post("/create-booking-appointment", createMentorBookingAppointment);

export default router;

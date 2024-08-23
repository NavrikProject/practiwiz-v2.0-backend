import express from "express";
import {
  createMentorBookingAppointment,
  createMentorRazorPayOrder,
  MentorApprovedBookingAppointments,
  UpdateMentorBookingAppointment,
} from "../../Controllers/MentorControllers/MentorBookingController.js";

const router = express.Router();

router.post("/create-order", createMentorRazorPayOrder);
router.post("/create-booking-appointment", createMentorBookingAppointment);
router.post("/upcoming", MentorApprovedBookingAppointments);
// updating the mentor appointment
router.post("/update", UpdateMentorBookingAppointment);

export default router;

import express from "express";
import { MentorRegistration } from "../../Controllers/MentoControllers/MentorControllers.js";

const router = express.Router();
router.post("/register", MentorRegistration);

export default router;

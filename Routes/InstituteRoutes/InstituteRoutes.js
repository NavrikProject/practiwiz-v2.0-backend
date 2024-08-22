import express from "express";
import { fetchGuestLectures } from "../../Controllers/InstituteControllers/InstituteControllers.js";

const router = express.Router();
router.get("/guest-lectures", fetchGuestLectures);

export default router;

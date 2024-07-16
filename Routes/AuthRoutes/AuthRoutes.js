import routers from "express";
let router = routers.Router();
import { login } from "../../Controllers/AuthControllers/AuthControllers.js";

//login
router.post("/login", login);

export default router;

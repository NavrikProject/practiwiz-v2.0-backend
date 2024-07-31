import routers from "express";
let router = routers.Router();
import {
  login,
  userRegistration,
} from "../../Controllers/AuthControllers/AuthControllers.js";

//login
router.post("/login", login);
router.post("/user/register", userRegistration);

export default router;

import routers from "express";
let router = routers.Router();
import {
  changeUserPassword,
  login,
  userRegistration,
} from "../../Controllers/AuthControllers/AuthControllers.js";
import { verifyUserToken } from "../../Middleware/Authentication.js";

//login
router.post("/login", login);

router.post("/user/register", userRegistration);

// changing the password
router.post("/change/password", verifyUserToken, changeUserPassword);

export default router;

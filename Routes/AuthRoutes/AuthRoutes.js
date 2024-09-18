import routers from "express";
let router = routers.Router();
import {
  changeUserPassword,
  forgotPassword,
  login,
  resetPassword,
} from "../../Controllers/AuthControllers/AuthControllers.js";
import {
  verifyPasswordUserToken,
  verifyUserToken,
} from "../../Middleware/Authentication.js";

//login
router.post("/login", login);
// changing the password from dashboard
router.post("/change/password", verifyUserToken, changeUserPassword);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", verifyPasswordUserToken, resetPassword);

export default router;

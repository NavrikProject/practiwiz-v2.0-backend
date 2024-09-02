import routers from "express";
import {
  getAllApprovedMentorsListAdminDashboard,
  getAllNotApprovedMentorsListAdminDashboard,
  getAllUsersListAdminDashboard,
} from "../../Controllers/AdminDashboardControllers/AdminDashboardControllers.js";
let router = routers.Router();

//login
router.get("/users/all-list", getAllUsersListAdminDashboard);

router.get(
  "/mentors/approved/all-list",
  getAllApprovedMentorsListAdminDashboard
);

router.get(
  "/mentors/not-approved/all-list",
  getAllNotApprovedMentorsListAdminDashboard
);

export default router;

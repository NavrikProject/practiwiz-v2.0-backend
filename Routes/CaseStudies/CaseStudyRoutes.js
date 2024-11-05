import routers from "express";
import {
  CreateCaseStudyRazorPayMultiOrder,
  CreateCaseStudyRazorPaySingleOrder,
  fetchAllCaseStudyData,
  getCartTotalAmount,
  GetUsersPurchasedCaseStudyDetails,
  PayMultiCaseStudyAmount,
  PaySingleCaseStudyAmount,
} from "../../Controllers/CaseStydiesControllers/CaseStudiesController.js";
let router = routers.Router();

//login
router.get("/all-list", fetchAllCaseStudyData);

router.post("/cart/get-total-amount", getCartTotalAmount);

router.post("/cart/create-order", CreateCaseStudyRazorPayMultiOrder);

router.post("/cart/single-create-order", CreateCaseStudyRazorPaySingleOrder);

router.post("/cart/pay-case-study", PayMultiCaseStudyAmount);

router.post("/cart/pay-single-case-study", PaySingleCaseStudyAmount);

router.get("/cart/purchased-items/:id", GetUsersPurchasedCaseStudyDetails);

export default router;

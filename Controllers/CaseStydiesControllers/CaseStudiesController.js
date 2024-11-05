import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import moment from "moment";
import crypto from "crypto";
import { CaseStudiesData } from "../../Data/CaseStudiesData.js";
import Razorpay from "razorpay";
import { RazorpayBookingOrderQuery } from "../../SQLQueries/MentorSQLQueries.js";
import { InsertCaseStudyPurchaseDetails } from "../../SQLQueries/CaseStudy/CaseStudySqlQueries.js";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import {
  CaseStudyHeading,
  CaseStudyPurchasedMessage,
  SuccessMsg,
} from "../../Messages/Messages.js";
import { error } from "console";

dotenv.config();

export const fetchAllCaseStudyData = (req, res) => {
  try {
    return res.json({ success: CaseStudiesData });
  } catch (error) {
    return res.json({
      error: "There is some problem fetching case study data",
    });
  }
};

export const getCartTotalAmount = async (req, res) => {
  try {
    const { cart } = req.body;
    // Fetch item prices from your database
    let totalAmount = 0;
    for (const item of cart) {
      const itemDetails = CaseStudiesData.find((item2) => item2.id === item.id);
      // Assuming you're using Mongoose or a similar ORM
      if (itemDetails) {
        totalAmount += itemDetails.price * 100;
      }
    }
    return res.json({ success: totalAmount });
  } catch (err) {
    return res.json({ error: "Failed to fetch total amount" });
  }
};

export const CreateCaseStudyRazorPayMultiOrder = (req, res, next) => {
  const { userEmail, userId, cart } = req.body;
  try {
    let totalAmount = 0;
    for (const item of cart) {
      const itemDetails = CaseStudiesData.find((item2) => item2.id === item.id);
      // Assuming you're using Mongoose or a similar ORM
      if (itemDetails) {
        totalAmount += parseInt(itemDetails.price);
      }
    }
    console.log(totalAmount);
    sql.connect(config, (err) => {
      if (err) {
        return res.json({
          error: "There is some error while creating the order",
        });
      }
      const request = new sql.Request();

      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET_STRING,
      });
      const options = {
        amount: totalAmount * 100,
        currency: "INR",
      };
      instance.orders
        .create(options)
        .then((order) => {
          request.input("bookingMCRazDltsId", sql.Int, 55);
          request.input("bookingRazUserDtlsId", sql.Int, userId);
          request.input("userEmail", sql.VarChar, userEmail);
          request.input("amount", sql.Decimal, order.amount);
          request.input("amountDue", sql.Decimal, order.amount_due);
          request.input("amountPaid", sql.Decimal, order.amount_paid);
          request.input("attempts", sql.Int, order.attempts);
          request.input("createdAt", sql.Int, order.created_at);
          request.input("currency", sql.VarChar, order.currency);
          request.input("entity", sql.VarChar, order.entity);
          request.input("id", sql.VarChar, order.id);
          request.input("offerId", sql.VarChar, order.offer_id);
          request.input("receipt", sql.VarChar, order.receipt);
          request.input("status", sql.VarChar, order.status);
          request.input("type", sql.VarChar, "case study booking");
          request.query(RazorpayBookingOrderQuery, (err, result) => {
            if (err) return res.json({ error: err.message });
            if (result) return res.json({ success: order });
          });
        })
        .catch((error) => {
          return res.json({ error: error.message });
        });
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

export const PayMultiCaseStudyAmount = async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature, amount } =
    req.body;
  try {
    // Create the expected signature from RazorpayOrderId and PaymentId using your Razorpay Secret Key
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET_STRING)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Razorpay signature" });
    }
    // Create Razorpay instance with your credentials
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET_STRING,
    });
    // Fetch payment details from Razorpay to verify the amount
    const payment = await razorpay.payments.fetch(razorpayPaymentId);
    if (payment.amount !== amount) {
      return res
        .status(400)
        .json({ success: false, message: "Payment amount mismatch" });
    }
    // Continue with your business logic (e.g., create order, record payment, etc.)
    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  } catch (err) {
    console.error("Error verifying Razorpay payment:", err);
    res
      .status(500)
      .json({ success: false, message: "Error verifying payment" });
  }
};

export const CreateCaseStudyRazorPaySingleOrder = (req, res, next) => {
  const { userEmail, userId, caseStudy } = req.body;
  try {
    let totalAmount = 0;
    const itemDetails = CaseStudiesData.find(
      (item2) => item2.id === caseStudy.id
    );
    totalAmount = parseInt(itemDetails.price);
    sql.connect(config, (err) => {
      if (err) {
        return res.json({
          error: "There is some error while creating the order",
        });
      }
      const request = new sql.Request();

      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET_STRING,
      });
      const options = {
        amount: totalAmount * 100,
        currency: "INR",
      };
      instance.orders
        .create(options)
        .then((order) => {
          request.input("bookingMCRazDltsId", sql.Int, 55);
          request.input("bookingRazUserDtlsId", sql.Int, userId);
          request.input("userEmail", sql.VarChar, userEmail);
          request.input("amount", sql.Decimal, order.amount);
          request.input("amountDue", sql.Decimal, order.amount_due);
          request.input("amountPaid", sql.Decimal, order.amount_paid);
          request.input("attempts", sql.Int, order.attempts);
          request.input("createdAt", sql.Int, order.created_at);
          request.input("currency", sql.VarChar, order.currency);
          request.input("entity", sql.VarChar, order.entity);
          request.input("id", sql.VarChar, order.id);
          request.input("offerId", sql.VarChar, order.offer_id);
          request.input("receipt", sql.VarChar, order.receipt);
          request.input("status", sql.VarChar, order.status);
          request.input("type", sql.VarChar, "case study booking");
          request.query(RazorpayBookingOrderQuery, (err, result) => {
            if (err) return res.json({ error: err.message });
            if (result) return res.json({ success: order });
          });
        })
        .catch((error) => {
          return res.json({ error: error.message });
        });
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

export const PaySingleCaseStudyAmount = async (req, res) => {
  const {
    amount,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    userId,
    userEmail,
    username,
    caseStudyId,
  } = req.body;
  let paidStatus = "not paid";
  try {
    // Create the expected signature from RazorpayOrderId and PaymentId using your Razorpay Secret Key
    sql.connect(config, async (err, db) => {
      if (err) return res.json({ error: err.message });
      const request = new sql.Request();
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET_STRING)
        .update(razorpayOrderId + "|" + razorpayPaymentId)
        .digest("hex");
      if (generatedSignature !== razorpaySignature) {
        paidStatus = "There are some issue with the payment signature";
        request.input("userDtlsId", sql.Int, userId);
        request.input("caseStudyDtlsId", sql.Int, caseStudyId);
        request.input("purchaseAmount", sql.Decimal(10, 2), amount);
        request.input("razorpayPaymentId", sql.VarChar(50), razorpayPaymentId);
        request.input("razorpayOrderId", sql.VarChar(50), razorpayOrderId);
        request.input("razorpaySignature", sql.Text, razorpaySignature);
        request.input("amountPaidStatus", sql.VarChar(50), paidStatus);
        request.query(InsertCaseStudyPurchaseDetails, (err, result) => {
          if (err) {
            return res.json({ error: err.message });
          }
          if (result) {
            const notificationHandler = InsertNotificationHandler(
              userId,
              SuccessMsg,
              CaseStudyHeading,
              "There is some error while purchasing the case study"
            );
            return res.json({
              success:
                "There is some error while purchasing the case study, signature mismatch",
            });
          }
        });
      }
      // Create Razorpay instance with your credentials
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET_STRING,
      });
      // Fetch payment details from Razorpay to verify the amount
      const payment = await razorpay.payments.fetch(razorpayPaymentId);
      console.log(payment);
      if (payment.amount !== amount) {
        paidStatus = "The paid amount is not equal to the amount";
        request.input("userDtlsId", sql.Int, userId);
        request.input("caseStudyDtlsId", sql.Int, caseStudyId);
        request.input("purchaseAmount", sql.Decimal(10, 2), amount);
        request.input("razorpayPaymentId", sql.VarChar(50), razorpayPaymentId);
        request.input("razorpayOrderId", sql.VarChar(50), razorpayOrderId);
        request.input("razorpaySignature", sql.Text, razorpaySignature);
        request.input("amountPaidStatus", sql.VarChar(50), paidStatus);
        request.query(InsertCaseStudyPurchaseDetails, (err, result) => {
          if (err) {
            return res.json({ error: err.message });
          }
          if (result) {
            const notificationHandler = InsertNotificationHandler(
              userId,
              SuccessMsg,
              CaseStudyHeading,
              "There is some error while purchasing the case study"
            );
            return res.json({
              success:
                "There is some error while purchasing the case study, amount is mismatch",
            });
          }
        });
      }
      if (payment.status === "captured") {
        paidStatus = "paid";
        request.input("userDtlsId", sql.Int, userId);
        request.input("caseStudyDtlsId", sql.Int, caseStudyId);
        request.input("purchaseAmount", sql.Decimal(10, 2), amount);
        request.input("razorpayPaymentId", sql.VarChar(50), razorpayPaymentId);
        request.input("razorpayOrderId", sql.VarChar(50), razorpayOrderId);
        request.input("razorpaySignature", sql.Text, razorpaySignature);
        request.input("amountPaidStatus", sql.VarChar(50), paidStatus);
        request.query(InsertCaseStudyPurchaseDetails, (err, result) => {
          if (err) {
            return res.json({ error: err.message });
          }
          if (result) {
            const notificationHandler = InsertNotificationHandler(
              userId,
              SuccessMsg,
              CaseStudyHeading,
              CaseStudyPurchasedMessage
            );
            return res.json({
              success: "Successfully you have purchased the case study",
            });
          }
        });
      }
    });
  } catch (err) {
    return res.json({
      error: err.message,
    });
  }
};

export const GetUsersPurchasedCaseStudyDetails = (req, res) => {
  const { id } = req.params;
  let purchaseArray = [];
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: err.message });
      const request = new sql.Request();
      request.input("userId", sql.Int, id);
      request.query(
        "select case_study_dtls_id from case_study_purchase_dtls where case_study_purchase_user_dtls_id = @userId",
        (err, result) => {
          if (err) {
            return res.json({ error: err.message });
          }
          if (result.recordset.length > 0) {
            for (const item of result.recordset) {
              const caseId = item.case_study_dtls_id;
              purchaseArray.push(caseId);
            }
            return res.json({ success: purchaseArray });
          } else {
            return res.json({ error: "" });
          }
        }
      );
    });
  } catch (error) {}
};

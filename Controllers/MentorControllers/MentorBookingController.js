import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import {
  MentorBookingAppointmentQuery,
  MentorBookingOrderQuery,
} from "../../SQLQueries/MentorSQLQueries.js";
import { MentorApprovedBookingQuery, UpdateMentorBookingAppointmentQuery } from "../../SQLQueries/MentorBookingQueries.js";

dotenv.config();

//create razor pay order
export async function createMentorRazorPayOrder(req, res, next) {
  const { mentorId, menteeEmail, userId } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err) {
        return res.send(err.message);
      }
      const request = new sql.Request();
      request.input("mentorId", sql.Int, mentorId);
      request.query(
        "select * from mentor_dtls where mentor_dtls_id = @mentorId",
        (err, result) => {
          if (err) return res.send(err.message);
          if (result.recordset.length > 0) {
            const mentorPrice = result.recordset[0].mentor_amount;
            const instance = new Razorpay({
              key_id: process.env.RAZORPAY_KEY_ID,
              key_secret: process.env.RAZORPAY_KEY_SECRET_STRING,
            });
            const options = {
              amount: mentorPrice * 100,
              currency: "INR",
            };
            instance.orders
              .create(options)
              .then((order) => {
                request.input("mentorBookingRazDltsId", sql.Int, mentorId);
                request.input("menteeBookingRazUserDtlsId", sql.Int, userId);
                request.input("menteeEmail", sql.VarChar, menteeEmail);
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
                request.query(MentorBookingOrderQuery, (err, result) => {
                  if (err) return res.json({ error: err.message });
                  if (result) return res.json({ success: order });
                });
              })
              .catch((error) => {
                return res.send({ error: error.message });
              });
          } else {
            return res.send({
              error: "There is an error while booking the appointment",
            });
          }
        }
      );
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

// create the mentor booking appointment

export async function createMentorBookingAppointment(req, res, next) {
  const {
    mentorId,
    userId,
    date,
    from,
    to,
    amount,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
  } = req.body;
  const { questions, selected } = req.body.data;
  let ChangedDate = new Date(
    new Date(date).setDate(new Date(date).getDate() + 1)
  );
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.send({ error: err.message });
      if (db) {
        const request = new sql.Request();
        request.input("mentorDtlsId", sql.Int, mentorId);
        request.input("menteeUserDtlsId", sql.Int, userId);
        request.input("mentorSessionBookingDate", sql.Date, ChangedDate);
        request.input(
          "mentorBookedDate",
          sql.Date,
          new Date().toISOString().substring(0, 10)
        );
        request.input("mentorBookingStartsTime", sql.VarChar, from);
        request.input("mentorBookingEndTime", sql.VarChar, to);
        request.input("mentorBookingTime", sql.VarChar, from + "-" + to);
        request.input("mentorAmount", sql.Decimal(10, 2), amount / 100);
        request.input("mentorOptions", sql.VarChar, selected);
        request.input("mentorQuestions", sql.VarChar, questions);
        request.input(
          "mentorRazorpayPaymentId",
          sql.VarChar,
          razorpayPaymentId
        );
        request.input("mentorRazorpayOrderId", sql.VarChar, razorpayOrderId);
        request.input(
          "mentorRazorpaySignature",
          sql.VarChar,
          razorpaySignature
        );
        request.input("mentorHostUrl", sql.VarChar, "Mentor host url");
        request.input("traineeJoinUrl", sql.VarChar, "trainee join url");
        request.input("mentorAmountPaidStatus", sql.VarChar, "Yes");
        request.query(MentorBookingAppointmentQuery, (err, result) => {
          if (err) {
            return res.send({
              error: err.message,
            });
          }
          if (result) {
            return res.json({ success: "Successfully appointment is created" });
          }
        });
      }
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
}

// get the upcoming mentor appointments

export async function MentorApprovedBookingAppointments(req, res) {
  const { userDtlsId } = req.body;
  console.log(userDtlsId);
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: "There is some error while fetching" });
      const request = new sql.Request();
      request.input("mentorUserDtlsId", sql.Int, userDtlsId);
      request.query(MentorApprovedBookingQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result && result.recordset && result.recordset.length > 0) {
          return res.json({ success: result.recordset });
        }
      });
    });
  } catch (error) {
    return res.json({ error: "There is some error while fetching" });
  }
}

// update the mentor booking appointment
export async function UpdateMentorBookingAppointment(req, res, next) {
  const { bookingId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: "There is some error while fetching" });
      const request = new sql.Request();
      request.input("bookingId", sql.Int, bookingId);
      request.query(UpdateMentorBookingAppointmentQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          return res.json({ success: "Successfully updated the appointment" });
        }
      });
    });
  } catch (error) {
    return res.json({ error: "There is some error while fetching" });
  }
}

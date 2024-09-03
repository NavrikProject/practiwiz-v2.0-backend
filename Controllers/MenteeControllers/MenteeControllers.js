import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import moment from "moment";
import { userDtlsQuery } from "../../SQLQueries/MentorSQLQueries.js";
import {
  IsFeedbackSubmittedQuery,
  MenteeApprovedBookingQuery,
  MenteeCompletedBookingQuery,
  MenteeFeedbackSubmitHandlerQuery,
  MenteeRegisterQuery,
} from "../../SQLQueries/MenteeSqlQueries.js";
import { accountCreatedEmailTemplate } from "../../EmailTemplates/AccountEmailTemplate/AccountEmailTemplate.js";
dotenv.config();

// registering of the mentor application
export async function MenteeRegistration(req, res, next) {
  const {
    mentee_About,
    mentee_Email,
    mentee_Skills,
    mentee_firstname,
    mentee_gender,
    mentee_lastname,
    mentee_phone_number,
    mentee_type,
    mentor_password,
  } = req.body.data;
  const { userType } = req.body;

  const lowEmail = mentee_Email.toLowerCase();
  const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  let saltRounds = await bcrypt.genSalt(12);
  let hashedPassword = await bcrypt.hash(mentor_password, saltRounds);

  sql.connect(config, async (err) => {
    if (err) {
      return res.send({ error: "There is something wrong!" });
    }
    const request = new sql.Request();
    request.input("email", sql.VarChar, lowEmail);
    request.query(
      "select user_email from users_dtls where user_email = @email",
      (err, result) => {
        if (err) return res.json({ error: "There is something wrong!" });
        if (result.recordset.length > 0) {
          return res.json({
            error:
              "This email address is already in use, Please use another email address",
          });
        } else {
          const request = new sql.Request();
          // Add input parameters
          request.input("user_email", sql.VarChar, lowEmail);
          request.input("user_pwd", sql.VarChar, hashedPassword);
          request.input("user_firstname", sql.VarChar, mentee_firstname);
          request.input("user_lastname", sql.VarChar, mentee_lastname);
          request.input("user_phone_number", sql.VarChar, mentee_phone_number);
          request.input("user_status", sql.VarChar, "1");
          request.input("user_modified_by", sql.VarChar, "Admin");
          request.input("user_type", sql.VarChar, userType);
          request.input("user_is_superadmin", sql.VarChar, "0");
          request.input("user_logindate", sql.Date, timestamp);
          request.input("user_logintime", sql.Date, timestamp);
          request.input("user_token", sql.VarChar, "");
          // Execute the query
          request.query(userDtlsQuery, (err, result) => {
            if (result && result.recordset && result.recordset.length > 0) {
              const userDtlsId = result.recordset[0].user_dtls_id;
              request.input("menteeUserDtlsId", sql.Int, userDtlsId);
              request.input("menteeAbout", sql.VarChar, mentee_About);
              request.input("menteeSkills", sql.VarChar, mentee_Skills);
              request.input("menteeGender", sql.VarChar, mentee_gender);
              request.input("menteeType", sql.VarChar, mentee_type);
              request.input(
                "menteeProfilePic",
                sql.VarChar,
                "mentee profile pic"
              );
              request.input("menteeCrDate", sql.Date, timestamp);
              request.input("menteeUpDate", sql.Date, timestamp);
              request.query(MenteeRegisterQuery, async (err, result) => {
                if (err) {
                  return res.json({
                    error: err.message,
                  });
                }
                if (result) {
                  const msg = accountCreatedEmailTemplate(
                    lowEmail,
                    mentee_firstname + " " + mentee_lastname
                  );
                  const response = await sendEmail(msg);
                  if (
                    response === "True" ||
                    response === "true" ||
                    response === true
                  ) {
                    return res.json({
                      success: "Thank you for registering as a mentee",
                    });
                  }
                  if (
                    response === "False" ||
                    response === "false" ||
                    response === false
                  ) {
                    return res.json({
                      success: "Thank you for registering as a mentee",
                    });
                  }
                }
              });
            } else {
              return res.json({ error: "No record inserted or returned." });
            }
          });
        }
      }
    );
  });
}

// get mentor approved or not approved booking appointments using the userid
export async function MenteeApprovedBookingAppointments(req, res) {
  const { userDtlsId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: "There is some error while fetching" });
      const request = new sql.Request();
      request.input("menteeUserDtlsId", sql.Int, userDtlsId);
      request.query(MenteeApprovedBookingQuery, (err, result) => {
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

// get mentor approved or not approved booking appointments using the userid
export async function MenteeCompletedBookingAppointments(req, res) {
  const { userDtlsId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: "There is some error while fetching" });
      const request = new sql.Request();
      request.input("menteeUserDtlsId", sql.Int, userDtlsId);
      request.query(MenteeCompletedBookingQuery, (err, result) => {
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

export async function MenteeFeedbackSubmitHandler(req, res) {
  const {
    platformExperience,
    contentRelevance,
    mentorCommunication,
    sessionPace,
    sessionFeedback,
    anotherSession,
    detailedSessionFeedback,
    mentorUserId,
    mentorDtlsId,
    menteeUserId,
    bookingId,
    overallRating,
  } = req.body;
  const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

  try {
    sql.connect(config, (err, db) => {
      if (err) return res.json({ error: err.message });
      const request = new sql.Request();
      request.input("mentorBookingID", sql.Int, bookingId);
      request.query(IsFeedbackSubmittedQuery, (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result.recordset.length === 0) {
          request.input("mentorDtlsId", sql.Int, mentorDtlsId);
          request.input("mentorUserDtlsId", sql.Int, mentorUserId);
          request.input("mentorApptBookingDtlsId", sql.Int, bookingId);
          request.input("menteeUserDtlsId", sql.Int, menteeUserId);
          request.input("sessionRelevant", sql.Int, contentRelevance);
          request.input("commSkills", sql.Int, mentorCommunication);
          request.input("sessionAppropriate", sql.Int, sessionPace);
          request.input("detailedFb", sql.Text, detailedSessionFeedback);
          request.input("fbSugg", sql.Text, sessionFeedback);
          request.input("anotherSession", sql.VarChar(10), anotherSession);
          request.input("overallRating", sql.Int, overallRating);
          request.input("platformRating", sql.Int, platformExperience);
          request.input("mentorFeedbackDtlsCrDate", sql.Date, timestamp);
          request.query(MenteeFeedbackSubmitHandlerQuery, (err, result) => {
            if (err) return res.json({ error: err.message });
            if (result) {
              return res.json({ success: "Thank you for your feedback" });
            }
          });
        } else {
          return res.json({
            success: "You have all ready submitted the feedback. Thank you",
          });
        }
      });
    });
  } catch (error) {
    return res.json({ error: "There is some error while fetching" });
  }
}

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import moment from "moment";
import { userDtlsQuery } from "../../SQLQueries/MentorSQLQueries.js";
import { MenteeRegisterQuery } from "../../SQLQueries/MenteeSqlQueries.js";
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
          request.input("user_is_superadmin", sql.VarChar, "1");
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
              request.query(MenteeRegisterQuery, (err, result) => {
                if (err) {
                  return res.json({
                    error: "There is some error while registering",
                  });
                }
                if (result) {
                  return res.json({
                    success: "You have successfully registered",
                  });
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

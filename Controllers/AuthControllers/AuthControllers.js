import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import moment from "moment";

import {
  mentorDtlsQuery,
  mentorExpertiseQuery,
  userDtlsQuery,
} from "../../SQLQueries/MentorSQLQueries.js";
import { uploadMentorPhotoToAzure } from "../../Middleware/AllFunctions.js";
import { mentorApplicationEmail } from "../../EmailTemplates/MentorEmailTemplate/MentorEmailTemplate.js";
dotenv.config();

// user registration status table insert

export async function UserRegistrationStatus(req, res) {
  const { firstName, lastName, email, UserType, phoneNumber } = req.body;
  const lowEmail = email.toLowerCase();
  const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  try {
    sql.connect(config, async (err) => {
      if (err) {
        return res.send({ error: "There is something wrong!" });
      }
      const request = new sql.Request();
      request.input("email", sql.VarChar, lowEmail);
      request.query(
        "select user_reg_email from users_reg_dtls where user_email = @email",
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
            request.input("user_reg_email", sql.VarChar, email);
            request.input("user_reg_firstname", sql.VarChar, firstName);
            request.input("user_reg_lastname", sql.VarChar, lastName);
            request.input("user_reg_phone_number", sql.VarChar, phoneNumber);
            request.input("user_reg_type", sql.VarChar, UserType);
            request.input("user_reg_logindate", sql.Date, timestamp);
            // Execute the query
            request.query(userDtlsQuery, (err, result) => {
              if (err) {
                return res.json({ error: err.message });
              }
              if (result) {
                return res.json({ success: "success" });
              }
            });
          }
        }
      );
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
}
// logging in to the portal
export async function login(req, res) {
  let { email, password } = req.body;
  email = email.toLowerCase();
  if (!email || !password) {
    return res.json({ error: "Invalid email or password" });
  }
  try {
    sql.connect(config, async (err) => {
      if (err) {
        return res.json({ error: err.message });
      }
      const request = new sql.Request();
      request.input("email", sql.VarChar, email);
      request.query(
        `select * from users_dtls where user_email = @email`,
        (err, result) => {
          if (result?.recordset.length > 0) {
            bcrypt.compare(
              password,
              result.recordset[0].user_pwd,
              (err, response) => {
                if (!response) {
                  return res.json({
                    error:
                      "You have entered incorrect password,Please try again or re-enter your password",
                  });
                }
                if (response) {
                  const accessToken = jwt.sign(
                    {
                      user_id: result.recordset[0].user_dtls_id,
                      user_role: result.recordset[0].user_is_superadmin,
                    },
                    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
                    { expiresIn: "48h" }
                  );
                  const token = jwt.sign(
                    {
                      user_id: result.recordset[0].user_dtls_id,
                      user_email: result.recordset[0].user_email,
                      user_firstname: result.recordset[0].user_firstname,
                      user_lastname: result.recordset[0].user_lastname,
                      user_type: result.recordset[0].user_type,
                      user_role: result.recordset[0].user_is_superadmin,
                    },
                    process.env.JWT_LOGIN_SECRET_KEY,
                    { expiresIn: "48h" }
                  );
                  return res.json({
                    success: true,
                    token: token,
                    accessToken: accessToken,
                  });
                } else {
                  return res.json({
                    error: "Sorry you have entered incorrect password",
                  });
                }
              }
            );
          } else {
            return res.json({
              error:
                "There is no account with that email address, user type, Please sign up! ",
            });
          }
        }
      );
    });
  } catch (error) {
    return res.json({
      error: "There is some error while logging in. Please try again",
    });
  }
}
// mentor regist
export async function userRegistration(req, res, next) {
  const {
    firstName,
    lastName,
    email,
    UserType,
    phoneNumber,
    password,
    sociallink,
    jobtitle,
    experience,
    companyName,
    passionateAbout,
    AreaOfexpertise,
    academicQualification,
    areaofmentorship,
    headline,
    lecturesInterest,
    caseInterest,
    freeCharge,
    Timezone,
    Language,
    Country,
    Mon,
    Tue,
    Wed,
    Thu,
    Fri,
    Sat,
    Sun,
  } = req.body;
  const imageData = req.files;
  //console.log(req.files.image);
  const lowEmail = email.toLowerCase();
  const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  if (
    !lowEmail &&
    !password &&
    !firstName &&
    !lastName &&
    !UserType &&
    !phoneNumber
  ) {
    return res.json({
      required: "All details must be required",
    });
  }
  const blobName = new Date().getTime() + "-" + req.files.image.name;
  const filename = `https://practiwizstorage.blob.core.windows.net/practiwizcontainer/mentorprofilepictures/${blobName}`;
  uploadMentorPhotoToAzure(imageData, blobName);

  let saltRounds = await bcrypt.genSalt(12);
  let hashedPassword = await bcrypt.hash(password, saltRounds);

  sql.connect(config, async (err) => {
    if (err) {
      return res.send({ error: "There is something wrong!" });
    }
    const request = new sql.Request();
    request.input("email", sql.VarChar, lowEmail);
    request.query(
      "select user_email from users_dtls where user_email = @email",
      (err, result) => {
        if (err)
          return res.status(500).json({ error: "There is something wrong!" });
        if (result.recordset.length > 0) {
          return res.status(500).json({
            error:
              "This email address is already in use, Please use another email address",
          });
        } else {
          const request = new sql.Request();
          // Add input parameters
          request.input("user_email", sql.VarChar, email);
          request.input("user_pwd", sql.VarChar, hashedPassword);
          request.input("user_firstname", sql.VarChar, firstName);
          request.input("user_lastname", sql.VarChar, lastName);
          request.input("user_phone_number", sql.VarChar, phoneNumber);
          request.input("user_status", sql.VarChar, "1");
          request.input("user_modified_by", sql.VarChar, "Admin");
          request.input("user_type", sql.VarChar, UserType);
          request.input("user_is_superadmin", sql.VarChar, "0");
          request.input("user_logindate", sql.Date, timestamp);
          request.input("user_logintime", sql.Date, timestamp);
          request.input("user_token", sql.VarChar, "");
          // Execute the query
          request.query(userDtlsQuery, (err, result) => {
            if (result && result.recordset && result.recordset.length > 0) {
              const userDtlsId = result.recordset[0].user_dtls_id;
              // Add input parameters
              request.input("mentor_user_dtls_id", sql.Int, userDtlsId);
              request.input("mentor_phone_number", sql.VarChar, phoneNumber);
              request.input("mentor_email", sql.VarChar, email);
              request.input("mentor_profile_photo", sql.VarChar, filename);
              request.input(
                "mentor_social_media_profile",
                sql.VarChar,
                sociallink
              );
              request.input("mentor_job_title", sql.VarChar, jobtitle);
              request.input("mentor_company_name", sql.VarChar, companyName);
              request.input("mentor_years_of_experience", sql.Int, experience);
              request.input(
                "mentor_academic_qualification",
                sql.VarChar,
                academicQualification
              );
              request.input(
                "mentor_recommended_area_of_mentorship",
                sql.VarChar,
                areaofmentorship
              );
              request.input(
                "mentor_guest_lectures_interest",
                sql.VarChar,
                lecturesInterest
              );
              request.input(
                "mentor_curating_case_studies_interest",
                sql.VarChar,
                caseInterest
              );
              request.input(
                "mentor_sessions_free_of_charge",
                sql.VarChar,
                freeCharge
              );
              request.input("mentor_language", sql.VarChar, Language);
              request.input("mentor_timezone", sql.VarChar, Timezone);
              request.input("mentor_country", sql.VarChar, Country);
              request.input("mentor_dtls_cr_date", sql.DateTime, timestamp);
              request.input("mentor_dtls_update_date", sql.DateTime, timestamp);
              request.input("mentor_headline", sql.VarChar, headline);
              // Execute the query
              request.query(mentorDtlsQuery, (err, result) => {
                if (err) {
                  console.log(
                    "There is something went wrong. Please try again later.",
                    err
                  );
                  return res.json({ err: err.message });
                }
                if (result && result.recordset && result.recordset.length > 0) {
                  const mentorDtlsId = result.recordset[0].mentor_dtls_id;
                  // adding area of expertise word in to table
                  const areaOfExpertiseWords = AreaOfexpertise.split(",");
                  areaOfExpertiseWords.forEach((word) => {
                    request.query(
                      "INSERT INTO mentor_expertise_dtls (mentor_dtls_id, mentor_expertise, mentor_exp_cr_date, mentor_exp_update_date) VALUES('" +
                        mentorDtlsId +
                        "','" +
                        word.trim() +
                        "','" +
                        timestamp +
                        "','" +
                        timestamp +
                        "')",
                      (err, success) => {
                        if (err) {
                          return res.send(
                            "There is something went wrong. Please try again later."
                          );
                        }
                        if (success) {
                          console.log("Data inserted successfully" + word);
                        }
                      }
                    );
                  });
                  // adding the passion about words in to table
                  //Parse the JSON string into a JavaScript array
                  const passionData = JSON.parse(passionateAbout);
                  // Loop through the array and process each object
                  passionData.forEach((item) => {
                    request.query(
                      "INSERT INTO mentor_passion_dtls (mentor_dtls_id, mentor_passion, mentor_passion_cr_date, mentor_passion_update_date) VALUES('" +
                        mentorDtlsId +
                        "','" +
                        item.text +
                        "','" +
                        timestamp +
                        "','" +
                        timestamp +
                        "')",
                      (err, success) => {
                        if (err) {
                          return res.send(
                            "There is something went wrong. Please try again later."
                          );
                        }
                        if (success) {
                          console.log(
                            "Passion Data inserted successfully " + item.text
                          );
                        }
                      }
                    );
                  });
                  if (Mon !== "undefined") {
                    const monDayParsedArray = JSON.parse(Mon);
                    arrayFunctions(
                      monDayParsedArray,
                      mentorDtlsId,
                      "Mon",
                      timestamp
                    );
                  } else if (Tue !== "undefined") {
                    const tueDayParsedArray = JSON.parse(Tue);
                    arrayFunctions(
                      tueDayParsedArray,
                      mentorDtlsId,
                      "Tue",
                      timestamp
                    );
                  } else if (Wed !== "undefined") {
                    const wedDayParsedArray = JSON.parse(Wed);
                    arrayFunctions(
                      wedDayParsedArray,
                      mentorDtlsId,
                      "Wed".timestamp
                    );
                  } else if (Thu !== "undefined") {
                    const thuDayParsedArray = JSON.parse(Thu);
                    arrayFunctions(
                      thuDayParsedArray,
                      mentorDtlsId,
                      "Wed",
                      timestamp
                    );
                  } else if (Fri !== "undefined") {
                    const friDayParsedArray = JSON.parse(Fri);
                    arrayFunctions(
                      friDayParsedArray,
                      mentorDtlsId,
                      "Fri",
                      timestamp
                    );
                  } else if (Sat !== "undefined") {
                    const satDayParsedArray = JSON.parse(Sat);
                    arrayFunctions(
                      satDayParsedArray,
                      mentorDtlsId,
                      "Sat",
                      timestamp
                    );
                  } else if (Sun !== "undefined") {
                    const sunDayParsedArray = JSON.parse(Sun);
                    arrayFunctions(
                      sunDayParsedArray,
                      mentorDtlsId,
                      "Sun",
                      timestamp
                    );
                  }
                  const msg = mentorApplicationEmail(
                    email,
                    firstName + " " + lastName
                  );
                  return res.json({
                    success: "Thank you for applying the mentor application",
                  });
                } else {
                  console.error("No record inserted or returned.");
                  return res.json({ err: "No record inserted or returned." });
                }
              });
            } else {
              console.error("No record inserted or returned.");
              return res.json({ err: "No record inserted or returned." });
            }
          });
        }
      }
    );
  });
}

function arrayFunctions(array, mentorDtlsId, day, timestamp) {
  try {
    sql.connect(config, (err, conn) => {
      if (conn) {
        const request = new sql.Request();
        array.forEach((item) => {
          const FromHour = item.from.hours;
          const FromMinute = item.from.minutes;
          const FromMeridian = item.from.ampm;
          const ToHour = item.to.hours;
          const ToMinute = item.to.minutes;
          const ToMeridian = item.to.ampm;
          const mentorRecType = item.mentor_timeslot_rec_indicator;
          const mentorRecEndDate = item.Mentor_timeslot_rec_end_date;
          const FromTime = FromHour + ":" + FromMinute + FromMeridian;
          const ToTime = ToHour + ":" + ToMinute + ToMeridian;
          console.log(mentorRecType);
          request.query(
            "INSERT INTO mentor_timeslots_dtls (mentor_dtls_id,mentor_timeslot_day,mentor_timeslot_from,mentor_timeslot_to,mentor_timeslot_rec_indicator,mentor_timeslot_rec_end_timeframe,mentor_timeslot_rec_cr_date,mentor_timeslot_rec_update_date) VALUES('" +
              mentorDtlsId +
              "','" +
              day +
              "','" +
              FromTime +
              "','" +
              ToTime +
              "','" +
              mentorRecType +
              "','" +
              mentorRecEndDate +
              "','" +
              timestamp +
              "','" +
              timestamp +
              "')",
            (err, success) => {
              if (err) {
                console.log(err.message);
              }
              if (success) {
                console.log("Data inserted successfully" + item);
              }
            }
          );
        });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

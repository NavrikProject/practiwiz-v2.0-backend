import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import {
  sendEmail,
  uploadMentorPhotoToAzure,
} from "../../Middleware/AllFunctions.js";
import moment from "moment";
import {
  fetchAllMentorQuery,
  fetchSingleMentorQuery,
  mentorDtlsQuery,
  userDtlsQuery,
} from "../../SQLQueries/MentorSQLQueries.js";
import { mentorApplicationEmail } from "../../EmailTemplates/MentorEmailTemplate/MentorEmailTemplate.js";
dotenv.config();

export async function MentorRegistration(req, res, next) {
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
          request.input("user_is_superadmin", sql.VarChar, "1");
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
              request.query(mentorDtlsQuery, async (err, result) => {
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
                  }
                  if (Tue !== "undefined") {
                    const tueDayParsedArray = JSON.parse(Tue);
                    arrayFunctions(
                      tueDayParsedArray,
                      mentorDtlsId,
                      "Tue",
                      timestamp
                    );
                  }
                  if (Wed !== "undefined") {
                    const wedDayParsedArray = JSON.parse(Wed);
                    arrayFunctions(
                      wedDayParsedArray,
                      mentorDtlsId,
                      "Wed".timestamp
                    );
                  }
                  if (Thu !== "undefined") {
                    const thuDayParsedArray = JSON.parse(Thu);
                    arrayFunctions(
                      thuDayParsedArray,
                      mentorDtlsId,
                      "Wed",
                      timestamp
                    );
                  }
                  if (Fri !== "undefined") {
                    const friDayParsedArray = JSON.parse(Fri);
                    arrayFunctions(
                      friDayParsedArray,
                      mentorDtlsId,
                      "Fri",
                      timestamp
                    );
                  }
                  if (Sat !== "undefined") {
                    const satDayParsedArray = JSON.parse(Sat);
                    arrayFunctions(
                      satDayParsedArray,
                      mentorDtlsId,
                      "Sat",
                      timestamp
                    );
                  }
                  if (Sun !== "undefined") {
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
                  const response = await sendEmail(msg);
                  if (
                    response === "True" ||
                    response === "true" ||
                    response === true
                  ) {
                    return res.json({
                      success: "Thank you for applying the mentor application",
                    });
                  }
                  if (
                    response === "False" ||
                    response === "false" ||
                    response === false
                  ) {
                    return res.json({
                      success: "Thank you for applying the mentor application",
                    });
                  }
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
          let mentorRecType = item.mentor_timeslot_rec_indicator;
          const mentorRecEndDate = item.recurring;
          const FromTime = FromHour + ":" + FromMinute + FromMeridian;
          const ToTime = ToHour + ":" + ToMinute + ToMeridian;
          if (
            mentorRecType === "" ||
            mentorRecType === "undefined" ||
            mentorRecType === null
          ) {
            mentorRecType = "Daily";
          }
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

export async function fetchSingleMentorDetails(req, res) {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: "There was an error while fetching the data.",
        });
      }
      if (db) {
        const request = new sql.Request();
        request.input("desired_mentor_dtls_id", sql.Int, userId);
        request.query(fetchSingleMentorQuery, (err, result) => {
          if (err) {
            return res.json({
              error: "There was an error while fetching the data.",
            });
          }
          if (result) {
            return res.json({
              success: result.recordset,
            });
          }
        });
      }
    });
  } catch (error) {
    return res.json({
      error: "There was an error while fetching the data.",
    });
  }
}

export async function fetchAllMentorDetails(req, res) {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: "There was an error while fetching the data.",
        });
      }
      if (db) {
        const request = new sql.Request();
        request.query(fetchAllMentorQuery, (err, result) => {
          if (err) {
            return res.json({
              error: "There was an error while fetching the data.",
            });
          }
          if (result) {
            return res.json({
              success: result.recordset,
            });
          }
        });
      }
    });
  } catch (error) {
    return res.json({
      error: "There was an error while fetching the data.",
    });
  }
}

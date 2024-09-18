import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import moment from "moment";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import {
  InfoMsg,
  MentorProfileChangedMessage,
  MentorProfileHeading,
} from "../../Messages/Messages.js";
dotenv.config();

export async function MentorUpdateMentorProfile1(req, res) {
  const { social_media_profile, mentor_country, mentor_city } =
    req.body.formData;
  const { userDtlsId } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err)
        return res.json({
          error: "There is some error while updating the Mentor profile",
        });
      const request = new sql.Request();
      request.input("userDtlsId", sql.Int, userDtlsId);
      request.query(
        "select user_dtls_id from users_dtls where user_dtls_id = @userDtlsId",
        (err, result) => {
          if (err) return res.json({ error: err.message });
          if (result.recordset.length > 0) {
            request.input("mentorUserDtlsId", sql.Int, userDtlsId);
            request.input("mentorCity", sql.VarChar, mentor_city);
            request.input("mentorCountry", sql.VarChar, mentor_country);
            request.input(
              "mentorLinkedinURL",
              sql.VarChar,
              social_media_profile
            );
            request.query(
              "update mentor_dtls set mentor_social_media_profile = @mentorLinkedinURL , mentor_country = @mentorCountry, mentor_city = @mentorCity where mentor_user_dtls_id = @mentorUserDtlsId",
              async (err, result) => {
                if (err) return res.json({ error: err.message });
                if (result) {
                  const notificationHandler = await InsertNotificationHandler(
                    userDtlsId,
                    InfoMsg,
                    MentorProfileHeading,
                    MentorProfileChangedMessage
                  );
                  return res.json({
                    success: "Successfully updated the profile details",
                  });
                }
              }
            );
          }
        }
      );
    });
  } catch (error) {
    return res.json({
      error: "There is some error while updating the Mentor profile",
    });
  }
}
export async function MentorUpdateMentorProfile2(req, res) {
  const {
    mentor_job_title,
    mentor_years_of_experience,
    mentor_company_name,
    mentor_academic_qualification,
    expertise_list,
    mentor_recommended_area_of_mentorship,
    mentor_headline,
    academic_qualification,
  } = req.body.formData;
  const { userDtlsId } = req.body;
  const passionAbout = JSON.parse(req.body.passionAboutList);
  const expertiseData = JSON.parse(expertise_list);

  try {
    sql.connect(config, (err) => {
      if (err)
        return res.json({
          error: "There is some error while updating the Mentor profile",
        });
      const request = new sql.Request();
      request.input("userDtlsId", sql.Int, userDtlsId);
      request.query(
        "select mentor_dtls_id from mentor_dtls where mentor_user_dtls_id = @userDtlsId",
        async (err, result) => {
          if (err) return res.json({ error: err.message });
          if (result.recordset.length > 0) {
            const mentorDtlsId = result.recordset[0].mentor_dtls_id;
            request.query(
              "update mentor_dtls set mentor_job_title = @jobTitle , mentor_years_of_experience = @experience, mentor_company_name = @companyName, mentor_academic_qualification= @qualification,mentor_recommended_area_of_mentorship = @areaMentorship where mentor_user_dtls_id = @mentorUserDtlsId",
              async (err, result) => {
                if (err) return res.json({ error: err.message });
                if (result) {
                  const notificationHandler = await InsertNotificationHandler(
                    userDtlsId,
                    InfoMsg,
                    MentorProfileHeading,
                    MentorProfileChangedMessage
                  );
                  return res.json({
                    success: "Successfully updated the profile details",
                  });
                }
              }
            );
            // expertiseData.forEach((expertise) => {
            //   // First check if the record exists, ignoring case for `mentor_expertise`
            //   request.query(
            //     "SELECT COUNT(*) AS count FROM mentor_expertise_dtls WHERE mentor_dtls_id = '" +
            //       mentorDtlsId +
            //       "' AND LOWER(mentor_expertise) = LOWER('" +
            //       expertise.mentor_expertise.trim() +
            //       "')",
            //     (err, result) => {
            //       if (err) {
            //         return res.json({
            //           error: err.message,
            //         });
            //       }

            //       // If no record exists, insert the new data
            //       if (result.recordset[0].count === 0) {
            //         request.query(
            //           "INSERT INTO mentor_expertise_dtls (mentor_dtls_id, mentor_expertise, mentor_exp_cr_date, mentor_exp_update_date) VALUES('" +
            //             mentorDtlsId +
            //             "','" +
            //             expertise.mentor_expertise.trim() +
            //             "','" +
            //             timestamp +
            //             "','" +
            //             timestamp +
            //             "')",
            //           (err, success) => {
            //             if (err) {
            //               return res.json({
            //                 error: err.message,
            //               });
            //             }
            //             if (success) {
            //               console.log(
            //                 "Data inserted successfully: " +
            //                   expertise.mentor_expertise
            //               );
            //             }
            //           }
            //         );
            //       } else {
            //         console.log(
            //           "Record already exists, skipping insert for: " +
            //             expertise.mentor_expertise
            //         );
            //       }
            //     }
            //   );
            // });
            // // adding the passion about words in to table
            // //Parse the JSON string into a JavaScript array
            // passionAbout.forEach((item) => {
            //   // First check if the record exists, ignoring case for `mentor_passion`
            //   request.query(
            //     "SELECT COUNT(*) AS count FROM mentor_passion_dtls WHERE mentor_dtls_id = '" +
            //       mentorDtlsId +
            //       "' AND LOWER(mentor_passion) = LOWER('" +
            //       item.text.trim() +
            //       "')",
            //     (err, result) => {
            //       if (err) {
            //         return res.json({
            //           error: err.message,
            //         });
            //       }

            //       // If no record exists, insert the new data
            //       if (result.recordset[0].count === 0) {
            //         request.query(
            //           "INSERT INTO mentor_passion_dtls (mentor_dtls_id, mentor_passion, mentor_passion_cr_date, mentor_passion_update_date) VALUES('" +
            //             mentorDtlsId +
            //             "','" +
            //             item.text.trim() +
            //             "','" +
            //             timestamp +
            //             "','" +
            //             timestamp +
            //             "')",
            //           (err, success) => {
            //             if (err) {
            //               return res.json({
            //                 error: err.message,
            //               });
            //             }
            //             if (success) {
            //               console.log(
            //                 "Passion Data inserted successfully: " + item.text
            //               );
            //             }
            //           }
            //         );
            //       } else {
            //         console.log(
            //           "Record already exists, skipping insert for passion: " +
            //             item.text
            //         );
            //       }
            //     }
            //   );
            // });
            const notificationHandler = await InsertNotificationHandler(
              userDtlsId,
              InfoMsg,
              MentorProfileHeading,
              MentorProfileChangedMessage
            );
            return res.json({ success: "Successfully updated the time slots" });
          }
        }
      );
    });
  } catch (error) {
    return res.json({
      error: "There is some error while updating the Mentor profile",
    });
  }
}
export async function MentorUpdateMentorProfile3(req, res) {
  const { Mon, Tue, Wed, Thu, Fri, Sat, Sun } = req.body;
  const { userDtlsId } = req.body;
  const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

  try {
    sql.connect(config, (err) => {
      if (err)
        return res.json({
          error: "There is some error while updating the Mentor profile",
        });
      const request = new sql.Request();
      request.input("userDtlsId", sql.Int, userDtlsId);
      request.query(
        "select mentor_dtls_id from mentor_dtls where mentor_user_dtls_id = @userDtlsId",
        async (err, result) => {
          if (err) return res.json({ error: err.message });
          if (result.recordset.length > 0) {
            const mentorDtlsId = result.recordset[0].mentor_dtls_id;
            if (typeof Mon !== "undefined" && Mon !== null) {
              const monDayParsedArray = JSON.parse(Mon);
              UpdateMentorTimeSlots(
                monDayParsedArray,
                mentorDtlsId,
                "Mon",
                timestamp
              );
            }
            if (typeof Tue !== "undefined" && Tue !== null) {
              const tueDayParsedArray = JSON.parse(Tue);
              UpdateMentorTimeSlots(
                tueDayParsedArray,
                mentorDtlsId,
                "Tue",
                timestamp
              );
            }
            if (typeof Wed !== "undefined" && Wed !== null) {
              const wedDayParsedArray = JSON.parse(Wed);
              UpdateMentorTimeSlots(
                wedDayParsedArray,
                mentorDtlsId,
                "Wed",
                timestamp
              );
            }
            if (typeof Thu !== "undefined" && Thu !== null) {
              const thuDayParsedArray = JSON.parse(Thu);
              UpdateMentorTimeSlots(
                thuDayParsedArray,
                mentorDtlsId,
                "Wed",
                timestamp
              );
            }
            if (typeof Fri !== "undefined" && Fri !== null) {
              const friDayParsedArray = JSON.parse(Fri);
              UpdateMentorTimeSlots(
                friDayParsedArray,
                mentorDtlsId,
                "Fri",
                timestamp
              );
            }
            if (typeof Sat !== "undefined" && Sat !== null) {
              const satDayParsedArray = JSON.parse(Sat);
              UpdateMentorTimeSlots(
                satDayParsedArray,
                mentorDtlsId,
                "Sat",
                timestamp
              );
            }
            if (typeof Sun !== "undefined" && Sun !== null) {
              const sunDayParsedArray = JSON.parse(Sun);
              UpdateMentorTimeSlots(
                sunDayParsedArray,
                mentorDtlsId,
                "Sun",
                timestamp
              );
            }
            const notificationHandler = await InsertNotificationHandler(
              userDtlsId,
              InfoMsg,
              MentorProfileHeading,
              MentorProfileChangedMessage
            );
            return res.json({ success: "Successfully updated the time slots" });
          }
        }
      );
    });
  } catch (error) {
    return res.json({
      error: "There is some error while updating the Mentor profile",
    });
  }
}
function UpdateMentorTimeSlots(array, mentorDtlsId, day, timestamp) {
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
          let mentorRecType = item.recurring.mentor_timeslot_rec_indicator;
          const mentorRecEndDate = item.date.Mentor_timeslot_rec_end_date;
          const FromTime = FromHour + ":" + FromMinute + FromMeridian;
          const ToTime = ToHour + ":" + ToMinute + ToMeridian;
          if (
            mentorRecType === "" ||
            mentorRecType === "undefined" ||
            mentorRecType === null
          ) {
            mentorRecType = "Daily";
          }
          // First check if the record exists
          request.query(
            "SELECT COUNT(*) AS count FROM mentor_timeslots_dtls WHERE mentor_dtls_id = '" +
              mentorDtlsId +
              "' AND mentor_timeslot_day = '" +
              day +
              "' AND mentor_timeslot_from = '" +
              FromTime +
              "' AND mentor_timeslot_rec_indicator = '" +
              mentorRecType +
              "'",
            (err, result) => {
              if (err) {
                console.log("Error checking existing record: " + err.message);
              } else if (result.recordset[0].count > 0) {
                console.log("Record already exists, insert skipped.");
              } else {
                // If no record exists, perform the insert
                request.query(
                  "INSERT INTO mentor_timeslots_dtls (mentor_dtls_id, mentor_timeslot_day, mentor_timeslot_from, mentor_timeslot_to, mentor_timeslot_rec_indicator, mentor_timeslot_rec_end_timeframe, mentor_timeslot_rec_cr_date, mentor_timeslot_rec_update_date) VALUES ('" +
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
                      console.log("Insert error: " + err.message);
                    } else {
                      console.log("Data inserted successfully: " + item);
                    }
                  }
                );
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
export async function MentorUpdateMentorProfile4(req, res) {
  const {
    mentor_curating_case_studies_interest,
    mentor_guest_lectures_interest,
    mentor_language,
    mentor_sessions_free_of_charge,
    mentor_timezone,
  } = req.body.formData;
  const { userDtlsId } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err)
        return res.json({
          error: "There is some error while updating the Mentor profile",
        });
      const request = new sql.Request();
      request.input("userDtlsId", sql.Int, userDtlsId);
      request.query(
        "select user_dtls_id from users_dtls where user_dtls_id = @userDtlsId",
        (err, result) => {
          if (err) return res.json({ error: err.message });
          if (result.recordset.length > 0) {
            request.input("mentorUserDtlsId", sql.Int, userDtlsId);
            request.input(
              "caseStudies",
              sql.VarChar,
              mentor_curating_case_studies_interest
            );
            request.input(
              "guestLecture",
              sql.VarChar,
              mentor_guest_lectures_interest
            );
            request.input("language", sql.VarChar, mentor_language);
            request.input(
              "freeOfCharge",
              sql.VarChar,
              mentor_sessions_free_of_charge
            );
            request.input("timezone", sql.VarChar, mentor_timezone);
            request.query(
              "update mentor_dtls set mentor_curating_case_studies_interest = @caseStudies , mentor_guest_lectures_interest = @guestLecture, mentor_language = @language,mentor_sessions_free_of_charge = @freeOfCharge,mentor_timezone = @timezone where mentor_user_dtls_id = @mentorUserDtlsId",
              async (err, result) => {
                if (err) return res.json({ error: err.message });
                if (result) {
                  const notificationHandler = await InsertNotificationHandler(
                    userDtlsId,
                    InfoMsg,
                    MentorProfileHeading,
                    MentorProfileChangedMessage
                  );
                  return res.json({
                    success: "Successfully updated the profile details",
                  });
                }
              }
            );
          }
        }
      );
    });
  } catch (error) {
    return res.json({
      error: "There is some error while updating the Mentor profile",
    });
  }
}

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
  SuccessMsg,
} from "../../Messages/Messages.js";
import {
  sendEmail,
  uploadMentorPhotoToAzure,
} from "../../Middleware/AllFunctions.js";
import {
  mentorProfilePicDashboardUpdateQuery,
  mentorProfilePictureDashboardUpdateQuery,
} from "../../SQLQueries/MentorDashboard/MentorDashboardUpdateSqlQueries.js";
dotenv.config();
// updation done
export async function MentorUpdateMentorProfile1(req, res) {
  const {
    social_media_profile,
    mentor_country,
    mentor_city,
    mentor_institute,
    mentor_academic_qualification,
    Mentor_Domain,
    jobtitle,
    experience,
    companyName,
    passionateAbout,
    AreaOfexpertise,
    areaofmentorship,
    headline,
    mentor_sessions_free_of_charge,
    mentor_guest_lectures_interest,
    mentor_curating_case_studies_interest,
    mentor_timezone,
    mentor_language,
    mentor_currency_type,
    mentor_session_price,
  } = req.body.formData;
  const { mentorUserDtlsId, mentor_email, mentorPhoneNumber } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err)
        return res.json({
          error: "There is some error while updating the Mentor profile",
        });
      const request = new sql.Request();
      request.input("mentorUserDtlsId", sql.Int, mentorUserDtlsId);
      request.query(
        "select mentor_user_dtls_id from mentor_dtls where mentor_user_dtls_id = @mentorUserDtlsId",
        (err, result) => {
          if (err) return res.json({ error: err.message });
          if (result.recordset.length > 0) {
            request.input("mentorCity", sql.VarChar, mentor_city);
            request.input("mentorCountry", sql.VarChar, mentor_country);
            request.input(
              "mentorLinkedinURL",
              sql.VarChar,
              social_media_profile
            );
            request.input(
              "mentorQualification",
              sql.VarChar,
              mentor_academic_qualification
            );
            request.input("mentorInstitute", sql.VarChar, mentor_institute);
            request.query(
              "update mentor_dtls set mentor_social_media_profile = @mentorLinkedinURL, mentor_country = @mentorCountry,mentor_academic_qualification = @mentorQualification,  mentor_city = @mentorCity, mentor_institute = @mentorInstitute where mentor_user_dtls_id = @mentorUserDtlsId",
              async (err, result) => {
                if (err) return res.json({ error: err.message });
                if (result) {
                  const notificationHandler = await InsertNotificationHandler(
                    mentorUserDtlsId,
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
          } else {
            request.input("mentor_user_dtls_id", sql.Int, mentorUserDtlsId);
            request.input(
              "mentor_phone_number",
              sql.VarChar,
              mentorPhoneNumber
            );
            request.input("mentor_email", sql.VarChar, mentor_email);
            request.input(
              "mentor_profile_photo",
              sql.VarChar,
              "https://practiwizstorage.blob.core.windows.net/practiwizcontainer/blue-circle-with-white-user_78370-4707.webp"
            );
            request.input(
              "mentor_social_media_profile",
              sql.VarChar,
              social_media_profile || ""
            );
            request.input("mentor_job_title", sql.VarChar, jobtitle || "");
            request.input(
              "mentor_company_name",
              sql.VarChar,
              companyName || ""
            );
            request.input(
              "mentor_years_of_experience",
              sql.Int,
              experience || ""
            );
            request.input(
              "mentor_academic_qualification",
              sql.VarChar,
              mentor_academic_qualification || ""
            );
            request.input(
              "mentor_recommended_area_of_mentorship",
              sql.VarChar,
              areaofmentorship || ""
            );
            request.input(
              "mentor_guest_lectures_interest",
              sql.VarChar,
              mentor_guest_lectures_interest || ""
            );
            request.input(
              "mentor_curating_case_studies_interest",
              sql.VarChar,
              mentor_curating_case_studies_interest || ""
            );
            request.input(
              "mentor_sessions_free_of_charge",
              sql.VarChar,
              mentor_sessions_free_of_charge || ""
            );
            request.input(
              "mentor_language",
              sql.VarChar,
              mentor_language || ""
            );
            request.input(
              "mentor_timezone",
              sql.VarChar,
              mentor_timezone || ""
            );
            request.input("mentor_country", sql.VarChar, mentor_country || "");
            request.input("mentor_headline", sql.VarChar, headline || "");
            request.input(
              "mentor_session_price",
              sql.VarChar,
              mentor_session_price || ""
            );
            request.input(
              "mentor_currency",
              sql.VarChar,
              mentor_currency_type || ""
            );
            request.input("City", sql.VarChar, mentor_city || "");
            request.input("Institute", sql.VarChar, mentor_institute || "");
            request.input("areaOfExpertise", sql.Text, AreaOfexpertise || "[]");
            request.input("passionAbout", sql.Text, passionateAbout || "[]");
            request.input("mentorDomain", sql.VarChar, Mentor_Domain || "");
            request.query(
              mentorProfilePicDashboardUpdateQuery,
              async (err, result) => {
                if (err) return res.json({ error: err.message });
                if (result) {
                  const notification = await InsertNotificationHandler(
                    mentorUserDtlsId,
                    SuccessMsg,
                    MentorProfileHeading,
                    MentorProfileChangedMessage
                  );
                  return res.json({
                    success: "Successfully updated the profile",
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
//wip
export async function MentorUpdateMentorProfile2(req, res) {
  const {
    social_media_profile,
    mentor_country,
    mentor_city,
    mentor_institute,
    mentor_academic_qualification,
    mentor_recommended_area_of_mentorship,
    mentor_years_of_experience,
    mentor_company_name,
    mentor_headline,
    mentor_job_title,
    mentor_sessions_free_of_charge,
    mentor_guest_lectures_interest,
    mentor_curating_case_studies_interest,
    mentor_timezone,
    mentor_language,
    mentor_currency_type,
    mentor_session_price,
    mentor_passion_dtls,
  } = req.body.formData;
  const {
    mentorUserDtlsId,
    mentor_email,
    mentorPhoneNumber,
    expertiseList,
    mentor_domain,
  } = req.body;
  try {
    sql.connect(config, (err) => {
      if (err)
        return res.json({
          error: "There is some error while updating the Mentor profile",
        });
      const request = new sql.Request();
      request.input("mentorUserDtlsId", sql.Int, mentorUserDtlsId);
      request.query(
        "select mentor_user_dtls_id from mentor_dtls where mentor_user_dtls_id = @mentorUserDtlsId",
        (err, result) => {
          if (err) return res.json({ error: err.message });
          if (result.recordset.length > 0) {
            request.input("companyName", sql.VarChar, mentor_company_name);
            request.input("mentorDomain", sql.Text, mentor_domain);
            request.input("headline", sql.VarChar, mentor_headline);
            request.input("jobTitle", sql.VarChar, mentor_job_title);
            request.input("mentorPassion", sql.Text, mentor_passion_dtls);
            request.input("mentorExpertise", sql.Text, expertiseList);
            request.input(
              "mentorship",
              sql.VarChar,
              mentor_recommended_area_of_mentorship
            );
            request.input(
              "experience",
              sql.VarChar,
              mentor_years_of_experience
            );
            request.query(
              "update mentor_dtls set mentor_company_name = @companyName, mentor_domain = @mentorDomain,mentor_headline = @headline, mentor_job_title = @jobTitle, mentor_years_of_experience = @experience,  mentor_recommended_area_of_mentorship = @mentorship,mentor_area_expertise = @mentorExpertise,mentor_passion_dtls = @mentorPassion  where mentor_user_dtls_id = @mentorUserDtlsId",
              async (err, result) => {
                if (err) return res.json({ error: err.message });
                if (result) {
                  const notificationHandler = await InsertNotificationHandler(
                    mentorUserDtlsId,
                    InfoMsg,
                    MentorProfileHeading,
                    MentorProfileChangedMessage
                  );
                  return res.json({
                    success: "Successfully updated the time slots",
                  });
                  s;
                }
              }
            );
          } else {
            request.input("mentor_user_dtls_id", sql.Int, mentorUserDtlsId);
            request.input(
              "mentor_phone_number",
              sql.VarChar,
              mentorPhoneNumber
            );
            request.input("mentor_email", sql.VarChar, mentor_email);
            request.input(
              "mentor_profile_photo",
              sql.VarChar,
              "https://practiwizstorage.blob.core.windows.net/practiwizcontainer/blue-circle-with-white-user_78370-4707.webp"
            );
            request.input(
              "mentor_social_media_profile",
              sql.VarChar,
              social_media_profile || ""
            );
            request.input(
              "mentor_job_title",
              sql.VarChar,
              mentor_job_title || ""
            );
            request.input(
              "mentor_company_name",
              sql.VarChar,
              mentor_company_name || ""
            );
            request.input(
              "mentor_years_of_experience",
              sql.Int,
              mentor_years_of_experience || ""
            );
            request.input(
              "mentor_academic_qualification",
              sql.VarChar,
              mentor_academic_qualification || ""
            );
            request.input(
              "mentor_recommended_area_of_mentorship",
              sql.VarChar,
              mentor_recommended_area_of_mentorship || ""
            );
            request.input(
              "mentor_guest_lectures_interest",
              sql.VarChar,
              mentor_guest_lectures_interest || ""
            );
            request.input(
              "mentor_curating_case_studies_interest",
              sql.VarChar,
              mentor_curating_case_studies_interest || ""
            );
            request.input(
              "mentor_sessions_free_of_charge",
              sql.VarChar,
              mentor_sessions_free_of_charge || ""
            );
            request.input(
              "mentor_language",
              sql.VarChar,
              mentor_language || ""
            );
            request.input(
              "mentor_timezone",
              sql.VarChar,
              mentor_timezone || ""
            );
            request.input("mentor_country", sql.VarChar, mentor_country || "");
            request.input(
              "mentor_headline",
              sql.VarChar,
              mentor_headline || ""
            );
            request.input(
              "mentor_session_price",
              sql.VarChar,
              mentor_session_price || ""
            );
            request.input(
              "mentor_currency",
              sql.VarChar,
              mentor_currency_type || ""
            );
            request.input("City", sql.VarChar, mentor_city || "");
            request.input("Institute", sql.VarChar, mentor_institute || "");
            request.input("areaOfExpertise", sql.Text, expertiseList || "[]");
            request.input(
              "passionAbout",
              sql.Text,
              mentor_passion_dtls || "[]"
            );
            request.input("mentorDomain", sql.VarChar, mentor_domain || "");
            request.query(
              mentorProfilePicDashboardUpdateQuery,
              async (err, result) => {
                if (err) return res.json({ error: err.message });
                if (result) {
                  const notification = await InsertNotificationHandler(
                    mentorUserDtlsId,
                    SuccessMsg,
                    MentorProfileHeading,
                    MentorProfileChangedMessage
                  );
                  return res.json({
                    success: "Successfully updated the profile",
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

// updates are done
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
          } else {
            return res.json({
              error:
                "Please update personal details before updating the time slots",
            });
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
    Mentor_Domain,
    sociallink,
    jobtitle,
    experience,
    companyName,
    passionateAbout,
    AreaOfexpertise,
    academicQualification,
    areaofmentorship,
    headline,
    Country,
    City,
    Institute,
    mentor_sessions_free_of_charge,
    mentor_guest_lectures_interest,
    mentor_curating_case_studies_interest,
    mentor_timezone,
    mentor_language,
    mentor_currency_type,
    mentor_session_price,
  } = req.body.formData;
  const { mentorUserDtlsId, mentor_email, mentorPhoneNumber } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err)
        return res.json({
          error: "There is some error while updating the profile details",
        });
      const request = new sql.Request();
      request.input("mentorUserDtlsId", sql.Int, mentorUserDtlsId);
      request.query(
        "select mentor_user_dtls_id from mentor_dtls where mentor_user_dtls_id = @mentorUserDtlsId",
        async (err, result) => {
          if (result.recordset.length > 0) {
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
          } else {
            request.input("mentor_user_dtls_id", sql.Int, mentorUserDtlsId);
            request.input(
              "mentor_phone_number",
              sql.VarChar,
              mentorPhoneNumber
            );
            request.input("mentor_email", sql.VarChar, mentor_email);
            request.input(
              "mentor_profile_photo",
              sql.VarChar,
              "https://practiwizstorage.blob.core.windows.net/practiwizcontainer/blue-circle-with-white-user_78370-4707.webp"
            );
            request.input(
              "mentor_social_media_profile",
              sql.VarChar,
              sociallink || ""
            );
            request.input("mentor_job_title", sql.VarChar, jobtitle || "");
            request.input(
              "mentor_company_name",
              sql.VarChar,
              companyName || ""
            );
            request.input(
              "mentor_years_of_experience",
              sql.Int,
              experience || ""
            );
            request.input(
              "mentor_academic_qualification",
              sql.VarChar,
              academicQualification || ""
            );
            request.input(
              "mentor_recommended_area_of_mentorship",
              sql.VarChar,
              areaofmentorship || ""
            );
            request.input(
              "mentor_guest_lectures_interest",
              sql.VarChar,
              mentor_guest_lectures_interest || ""
            );
            request.input(
              "mentor_curating_case_studies_interest",
              sql.VarChar,
              mentor_curating_case_studies_interest || ""
            );
            request.input(
              "mentor_sessions_free_of_charge",
              sql.VarChar,
              mentor_sessions_free_of_charge || ""
            );
            request.input(
              "mentor_language",
              sql.VarChar,
              mentor_language || ""
            );
            request.input(
              "mentor_timezone",
              sql.VarChar,
              mentor_timezone || ""
            );
            request.input("mentor_country", sql.VarChar, Country || "");
            request.input("mentor_headline", sql.VarChar, headline || "");
            request.input(
              "mentor_session_price",
              sql.VarChar,
              mentor_session_price || "1000"
            );
            request.input(
              "mentor_currency",
              sql.VarChar,
              mentor_currency_type || "INR"
            );
            request.input("City", sql.VarChar, City || "");
            request.input("Institute", sql.VarChar, Institute || "");
            request.input("areaOfExpertise", sql.Text, AreaOfexpertise || "[]");
            request.input("passionAbout", sql.Text, passionateAbout || "[]");
            request.input("mentorDomain", sql.VarChar, Mentor_Domain || "");
            request.query(
              mentorProfilePicDashboardUpdateQuery,
              async (err, result) => {
                if (err) return res.json({ error: err.message });
                if (result) {
                  const notification = await InsertNotificationHandler(
                    mentorUserDtlsId,
                    SuccessMsg,
                    MentorProfileHeading,
                    MentorProfileChangedMessage
                  );
                  return res.json({
                    success: "Successfully updated the profile",
                  });
                }
              }
            );
          }
        }
      );
    });
  } catch (error) {
    return res.json({ error: error.message });
  }

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
export async function UpdateMentorProfilePicture(req, res) {
  const {
    mentorUserDtlsId,
    mentorEmail,
    mentorPhoneNumber,
    Mentor_Domain,
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
    Pricing,
    City,
    Currency,
    Institute,
  } = req.body;
  try {
    if (!req.files.image) {
      return res.json({ error: "Please select a file to upload" });
    }
    const blobName = new Date().getTime() + "-" + req.files.image.name;
    var fileName = `https://practiwizstorage.blob.core.windows.net/practiwizcontainer/mentorprofilepictures/${blobName}`;
    uploadMentorPhotoToAzure(req.files, blobName);
    sql.connect(config, (err, db) => {
      if (err)
        return res.json({
          error: "There is some error while updating the profile details",
        });
      const request = new sql.Request();
      request.input("mentorUserDtlsId", sql.Int, mentorUserDtlsId);
      request.query(
        "select mentor_user_dtls_id from mentor_dtls where mentor_user_dtls_id = @mentorUserDtlsId",
        async (err, result) => {
          if (result.recordset.length > 0) {
            request.input("mentorProfileUrl", sql.VarChar, fileName);
            request.query(
              "update mentor_dtls set mentor_profile_photo = @mentorProfileUrl where mentor_user_dtls_id = @mentorUserDtlsId",
              async (err, result) => {
                if (err) return res.json({ error: err.message });
                if (result) {
                  const notification = await InsertNotificationHandler(
                    mentorUserDtlsId,
                    SuccessMsg,
                    MentorProfileHeading,
                    MentorProfileChangedMessage
                  );
                  return res.json({
                    success: "Successfully updated the profile",
                  });
                }
              }
            );
          } else {
            request.input("mentor_user_dtls_id", sql.Int, mentorUserDtlsId);
            request.input(
              "mentor_phone_number",
              sql.VarChar,
              mentorPhoneNumber
            );
            request.input("mentor_email", sql.VarChar, mentorEmail);
            request.input("mentor_profile_photo", sql.VarChar, fileName);
            request.input(
              "mentor_social_media_profile",
              sql.VarChar,
              sociallink || ""
            );
            request.input("mentor_job_title", sql.VarChar, jobtitle || "");
            request.input(
              "mentor_company_name",
              sql.VarChar,
              companyName || ""
            );
            request.input(
              "mentor_years_of_experience",
              sql.Int,
              experience || ""
            );
            request.input(
              "mentor_academic_qualification",
              sql.VarChar,
              academicQualification || ""
            );
            request.input(
              "mentor_recommended_area_of_mentorship",
              sql.VarChar,
              areaofmentorship || ""
            );
            request.input(
              "mentor_guest_lectures_interest",
              sql.VarChar,
              lecturesInterest || ""
            );
            request.input(
              "mentor_curating_case_studies_interest",
              sql.VarChar,
              caseInterest || ""
            );
            request.input(
              "mentor_sessions_free_of_charge",
              sql.VarChar,
              freeCharge || ""
            );
            request.input("mentor_language", sql.VarChar, Language || "");
            request.input("mentor_timezone", sql.VarChar, Timezone || "");
            request.input("mentor_country", sql.VarChar, Country || "");
            request.input("mentor_headline", sql.VarChar, headline || "");
            request.input("mentor_session_price", sql.VarChar, Pricing || "");
            request.input("mentor_currency", sql.VarChar, Currency || "");
            request.input("City", sql.VarChar, City || "");
            request.input("Institute", sql.VarChar, Institute || "");
            request.input("areaOfExpertise", sql.Text, AreaOfexpertise || "[]");
            request.input("passionAbout", sql.Text, passionateAbout || "[]");
            request.input("mentorDomain", sql.VarChar, Mentor_Domain || "");
            request.query(
              mentorProfilePicDashboardUpdateQuery,
              async (err, result) => {
                if (err) return res.json({ error: err.message });
                if (result) {
                  const notification = await InsertNotificationHandler(
                    mentorUserDtlsId,
                    SuccessMsg,
                    MentorProfileHeading,
                    MentorProfileChangedMessage
                  );
                  return res.json({
                    success: "Successfully updated the profile",
                  });
                }
              }
            );
          }
        }
      );
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
}

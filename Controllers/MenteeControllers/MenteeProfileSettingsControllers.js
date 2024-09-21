import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import moment from "moment";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import {
  MenteeProfileChangedMessage,
  MentorProfileHeading,
  SuccessMsg,
} from "../../Messages/Messages.js";
import {
  MenteeEduWorkUpdateQuery,
  MenteeProfileUpdateQuery,
} from "../../SQLQueries/Mentee/MenteeProfileSqlQueries.js";
dotenv.config();

export async function UpdateMenteeProfileDetails(req, res, next) {
  const {
    mentee_instagram_link,
    mentee_linkedin_link,
    mentee_Twitter_link,
    mentee_language,
  } = req.body.formData;
  const { menteeUserDtlsId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err)
        return res.json({
          error: "There is some error while updating the profile details",
        });
      const request = new sql.Request();
      request.input("menteeUserDtlsId", sql.Int, menteeUserDtlsId);
      request.input("linkedinUrl", sql.VarChar, mentee_linkedin_link);
      request.input("instagramUrl", sql.VarChar, mentee_instagram_link);
      request.input("twitterUrl", sql.VarChar, mentee_Twitter_link);
      request.input("menteeLanguage", sql.VarChar, mentee_language);
      request.query(MenteeProfileUpdateQuery, async (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          const notification = await InsertNotificationHandler(
            menteeUserDtlsId,
            SuccessMsg,
            MentorProfileHeading,
            MenteeProfileChangedMessage
          );
          return res.json({ success: "Successfully updated the profile" });
        }
      });
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
}
export async function UpdateMenteeEduWorkDetails(req, res, next) {
  const { menteeUserDtlsId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err)
        return res.json({
          error: "There is some error while updating the profile details",
        });
      const request = new sql.Request();
      request.input("menteeUserDtlsId", sql.Int, menteeUserDtlsId);
      request.input("linkedinUrl", sql.VarChar, mentee_linkedin_link);
      request.input("instagramUrl", sql.VarChar, mentee_instagram_link);
      request.input("twitterUrl", sql.VarChar, mentee_Twitter_link);
      request.input("menteeLanguage", sql.VarChar, mentee_language);
      request.query(MenteeEduWorkUpdateQuery, async (err, result) => {
        if (err) return res.json({ error: err.message });
        if (result) {
          const notification = await InsertNotificationHandler(
            menteeUserDtlsId,
            SuccessMsg,
            MentorProfileHeading,
            MenteeProfileChangedMessage
          );
          return res.json({ success: "Successfully updated the profile" });
        }
      });
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
}

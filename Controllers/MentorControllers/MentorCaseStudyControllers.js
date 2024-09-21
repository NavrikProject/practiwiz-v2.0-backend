import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import {
  CaseStudySubmittedHeading,
  CaseStudySubmittedMessage,
  SuccessMsg,
} from "../../Messages/Messages.js";
import { insertMentorCaseStudyQuery } from "../../SQLQueries/MentorDashboard/CaseStudySQlQueries.js";

export async function createMentorCaseInput(req, res) {
  const {
    caseTopic,
    caseTopicTitle,
    lesson,
    futureSkills,
    characters,
    roleOfMainCharacter,
    challenge,
  } = req.body.data;
  const { mentorUserId, mentorDtlsId, roles } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err)
        return res.json({ error: "There is something wrong with submitting" });
      const request = new sql.Request();
      request.input("userId", sql.Int, mentorUserId);
      request.input("mentorId", sql.Int, mentorDtlsId);
      request.input("topicCategory", sql.VarChar(100), caseTopic);
      request.input("title", sql.Text, caseTopicTitle);
      request.input("lesson", sql.Text, lesson);
      request.input("peopleAfterRead", sql.Text, futureSkills);
      request.input("noCharacters", sql.Int, characters);
      request.input("roles", sql.Text, roles);
      request.input("mainRole", sql.VarChar(100), roleOfMainCharacter);
      request.input("mainChallenge", sql.Text, challenge);
      request.query(insertMentorCaseStudyQuery, (err, result) => {
        if (err)
          return res.json({
            error: err.message,
          });
        if (result) {
          const caseStudyNotification = InsertNotificationHandler(
            mentorUserId,
            SuccessMsg,
            CaseStudySubmittedHeading,
            CaseStudySubmittedMessage
          );
          return res.json({
            success: "Successfully submitted the case study.",
          });
        }
      });
    });
  } catch (error) {
    return res.json({ error: "There is something wrong with submitting" });
  }
}

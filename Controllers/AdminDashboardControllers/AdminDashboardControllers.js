import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import {
  fetchAllApprovedMentorQuery,
  fetchAllNotApprovedMentorQuery,
  UpdateMentorToApproveQuery,
  UpdateMentorToDisapproveQuery,
} from "../../SQLQueries/AdminDashboard/AdminSqlQueries.js";
import {
  mentorApplicationEmail,
  mentorApprovedEmailTemplate,
} from "../../EmailTemplates/MentorEmailTemplate/MentorEmailTemplate.js";
import { sendEmail } from "../../Middleware/AllFunctions.js";
import { InsertNotificationHandler } from "../../Middleware/NotificationFunction.js";
import {
  InfoMsg,
  MentorApprovedHeading,
  MentorApprovedMsg,
  MentorDisApprovedHeading,
  MentorDisApprovedMsg,
  SuccessMsg,
  WarningMsg,
} from "../../Messages/Messages.js";
dotenv.config();

export async function getAllUsersListAdminDashboard(req, res, next) {}
export async function getAllApprovedMentorsListAdminDashboard(req, res, next) {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.query(fetchAllApprovedMentorQuery, (err, result) => {
          if (err) {
            return res.json({
              error: err.message,
            });
          }
          if (result.recordset.length > 0) {
            return res.json({
              success: result.recordset,
            });
          } else {
            return res.json({
              error: "mentor is not approved yet",
            });
          }
        });
      }
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
}
export async function getAllNotApprovedMentorsListAdminDashboard(
  req,
  res,
  next
) {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.query(fetchAllNotApprovedMentorQuery, (err, result) => {
          if (err) {
            return res.json({
              error: err.message,
            });
          }
          if (result.recordset.length > 0) {
            return res.json({
              success: result.recordset,
            });
          } else {
            return res.json({
              error: "There are no current mentor applications.",
            });
          }
        });
      }
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
}
// updating the mentor to disapproving status
export async function UpdateMentorToDisapprove(req, res) {
  const { mentorDtlsId, mentorEmail, mentorName, userId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.input("mentorUserDtls", sql.Int, mentorDtlsId);
        request.query(UpdateMentorToDisapproveQuery, async (err, result) => {
          if (err) {
            return res.json({
              error: err.message,
            });
          }
          if (result) {
            const response = await InsertNotificationHandler(
              userId,
              WarningMsg,
              MentorDisApprovedHeading,
              MentorDisApprovedMsg
            );
            return res.json({
              success: "Success",
            });
          }
        });
      }
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
}
// updating the mentor to approving status
export async function UpdateMentorToApprove(req, res) {
  const { mentorDtlsId, mentorEmail, mentorName, userId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.input("mentorUserDtls", sql.Int, mentorDtlsId);
        request.query(UpdateMentorToApproveQuery, async (err, result) => {
          if (err) {
            return res.json({
              error: err.message,
            });
          }
          if (result) {
            const msg = mentorApprovedEmailTemplate(mentorEmail, mentorName);
            const notResponse = await InsertNotificationHandler(
              userId,
              SuccessMsg,
              MentorApprovedHeading,
              MentorApprovedMsg
            );
            const response = await sendEmail(msg);
            if (
              response === "True" ||
              response === "true" ||
              response === true
            ) {
              return res.json({
                success: "success",
              });
            }
            if (
              response === "False" ||
              response === "false" ||
              response === false
            ) {
              return res.json({
                success: "success",
              });
            }
          } else {
            return res.json({
              error: "mentor is not approved yet",
            });
          }
        });
      }
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
}

import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import {
  fetchAllApprovedMentorQuery,
  fetchAllNotApprovedMentorQuery,
} from "../../SQLQueries/AdminDashboard/AdminSqlQueries.js";
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

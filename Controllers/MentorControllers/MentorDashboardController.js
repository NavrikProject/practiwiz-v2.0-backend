import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import { fetchMentorSingleDashboard } from "../../SQLQueries/MentorSQLQueries.js";

dotenv.config();

// to fetch single mentor and need to pass the user id
export async function fetchSingleDashboardMentorDetails(req, res) {
  const { userId } = req.body;
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          error: err.message,
        });
      }
      if (db) {
        const request = new sql.Request();
        request.input("desired_mentor_dtls_id", sql.Int, userId);
        request.query(fetchMentorSingleDashboard, (err, result) => {
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

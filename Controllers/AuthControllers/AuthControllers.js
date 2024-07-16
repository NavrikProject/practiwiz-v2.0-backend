import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "mssql";
import config from "../../Config/dbConfig.js";
import dotenv from "dotenv";
dotenv.config();


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

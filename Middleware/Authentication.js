import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const verifyUserToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_LOGIN_SECRET_KEY, (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.send({ token: "Token is invalid or expired" });
      }
    });
  } else {
    return res.send({ token: "You are not authenticated" });
  }
};

export const verifyAdminAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    var replaceToken = token.replace('"', "");
    var replaceToken = replaceToken.replace('"', "");
    jwt.verify(
      replaceToken,
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      (err, user) => {
        if (!err) {
          req.user = user;
          next();
        } else {
          return res.json({ error: err.message });
        }
      }
    );
  } else {
    return res.json({ error: "Your have expired login,Please login again!" });
  }
};

export const verifyAdminTokenAndAuthorization = (req, res, next) => {
  verifyAdminAccessToken(req, res, () => {
    if (req.user.user_role === 1) {
      next();
    } else {
      return res.json({ error: "You don't have access this page" });
    }
  });
};

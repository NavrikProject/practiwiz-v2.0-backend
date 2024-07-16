import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRouter from "./Routes/AuthRoutes/AuthRoutes.js";

const app = express();
app.use(express.json());
app.use(morgan("common"));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
const port = 5000;

app.get("/", (req, res) => {
  const time = new Date().getTime();
  const date = new Date().toDateString();
  return res.json({
    success: `The server is working fine on the date ${date} and ${time}`,
  });
});
// auth routes
app.use("/api/v1/auth", authRouter);

app.listen(port, (req, res) => {
  console.log(`Running on port http://localhost:${port}`);
});

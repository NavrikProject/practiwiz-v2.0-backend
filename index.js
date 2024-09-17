import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import sql from "mssql";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { google } from "googleapis";
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import authRouter from "./Routes/AuthRoutes/AuthRoutes.js";
import mentorRouter from "./Routes/MentorRoutes/MentorRoutes.js";
import mentorBookingRouter from "./Routes/MentorRoutes/MentorBookingRoute.js";
import menteeRoute from "./Routes/MenteeRoutes/MenteeRoutes.js";
import instituteRoute from "./Routes/InstituteRoutes/InstituteRoutes.js";
import mentorDashboardRouter from "./Routes/MentorRoutes/MentorDashboard.js";
import adminDashboardRoute from "./Routes/AdminDashboard/AdminDashboardRoutes.js";
import config from "./Config/dbConfig.js";
import { InsertNotificationHandler } from "./Middleware/NotificationFunction.js";
import { accountCreatedEmailTemplate } from "./EmailTemplates/AccountEmailTemplate/AccountEmailTemplate.js";
import { sendEmail } from "./Middleware/AllFunctions.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 1337;

// Middleware to parse JSON bodies
app.use(express.json());

// HTTP request logger
app.use(morgan("common"));

// Parse cookies
app.use(cookieParser());

// Enable CORS
app.use(cors());

// Security middleware
app.use(helmet());

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for handling file uploads using express-fileupload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder for uploads (ensure it exists)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
  },
});

const upload = multer({ storage: storage });

// Middleware to handle CORS issues
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Endpoint to check server status
app.get("/", async (req, res) => {
  const time = new Date().getTime();
  const date = new Date().toDateString();
  return res.json({
    success: `The server is working fine on the date ${date} and ${time}`,
  });
});
// Endpoint to check server status
app.get("/test/db-connection", async (req, res) => {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        return res.json({
          message: "There was an error connecting to database",
          error: err.message,
        });
      }
      if (db) {
        return res.json({ success: "Connected to database successfully" });
      }
    });
  } catch (error) {
    return res.json({
      message: "There was an error connecting to database",
      error: err.message,
    });
  }
});
// razorpay key
app.get("/api/get-razorpay-key", (req, res) => {
  res.send({ key: process.env.RAZORPAY_KEY_ID });
});
// Authentication routes
app.use("/api/v1/auth", authRouter);

// Mentor routes
app.use("/api/v1/mentor", mentorRouter);
app.use("/api/v1/mentor/booking/appointment", mentorBookingRouter);
app.use("/api/v1/mentor/dashboard", mentorDashboardRouter);

// mentee routes
app.use("/api/v1/mentee", menteeRoute);

// institute routes
app.use("/api/v1/institute", instituteRoute);

// admin dashboard
app.use("/api/v1/admin/dashboard", adminDashboardRoute);

async function connectToDatabases() {
  try {
    sql.connect(config, (err, db) => {
      if (err) {
        console.log(err.message);
      }
      if (db) {
        console.log("Connected to database successfully");
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}
connectToDatabases();
setInterval(() => {
  connectToDatabases();
}, 3600000);

app.get("/test/email", async (req, res) => {
  const msg = accountCreatedEmailTemplate(
    "keeprememberall@gmail.com",
    "Mike",
    "link"
  );
  try {
    const emailRes = await sendEmail(msg);
    return res.json({ success: true, message: emailRes });
  } catch (error) {
    return res.json({
      message: "There was an error connecting to database",
      error: err.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Running on port http://localhost:${port}`);
  console.log("Working fine on " + process.env.PORT);
});

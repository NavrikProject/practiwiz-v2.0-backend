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
import authRouter from "./Routes/AuthRoutes/AuthRoutes.js";
import mentorRouter from "./Routes/MentorRoutes/MentorRoutes.js";
import config from "./Config/dbConfig.js";
import { mentorSelectSQLQuery } from "./SQLQueries/MentorSQLQueries.js";
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

// Authentication routes
app.use("/api/v1/auth", authRouter);

// Mentor routes
app.use("/api/v1/mentor", mentorRouter);

async function connectToDatabases() {
  const mentorId = 11;
  const mentorQuery = `
    SELECT 
        [mentor_dtls_id],
        [mentor_user_dtls_id],
        [mentor_phone_number],
        [mentor_email],
        [mentor_profile_photo],
        [mentor_social_media_profile],
        [mentor_job_title],
        [mentor_company_name],
        [mentor_years_of_experience],
        [mentor_academic_qualification],
        [mentor_recommended_area_of_mentorship],
        [mentor_guest_lectures_interest],
        [mentor_curating_case_studies_interest],
        [mentor_sessions_free_of_charge],
        [mentor_language],
        [mentor_timezone],
        [mentor_country],
        [mentor_dtls_cr_date],
        [mentor_dtls_update_date],
        [mentor_headline],
        [mentor_approved_status]
    FROM 
        [dbo].[mentor_dtls]
    WHERE 
        [mentor_dtls_id] = ?
`;

  const expertiseQuery = `
    SELECT 
        [mentor_expertise_id],
        [mentor_dtls_id],
        [mentor_expertise],
        [mentor_exp_cr_date],
        [mentor_exp_update_date]
    FROM 
        [dbo].[mentor_expertise_dtls]
    WHERE 
        [mentor_dtls_id] = ?
`;
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
}, 360000);
// Start the server
app.listen(port, () => {
  console.log(`Running on port http://localhost:${port}`);
  console.log("Working fine on " + process.env.PORT);
});

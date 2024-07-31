import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authRouter from "./Routes/AuthRoutes/AuthRoutes.js";
import mentorRouter from "./Routes/MentorRoutes/MentorRoutes.js";
import { BlobServiceClient } from "@azure/storage-blob";
import fs from "fs";
import { fileURLToPath } from "url";
import { MentorRegistration } from "./Controllers/MentoControllers/MentorControllers.js";

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

// Route to handle file upload
app.post(
  "/api/v1/mentor/registration/test",
  // Use Multer middleware to handle file upload
  (req, res) => {
    console.log(req.body);
    try {
      if (!req.files) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      console.log("File received:", req.files); // Log received file details
      res
        .status(200)
        .json({ message: "File uploaded successfully", file: req.file });
    } catch (error) {
      console.error("Error handling file:", error);
      res.status(500).json({ message: "Error uploading file" });
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Running on port http://localhost:${port}`);
  console.log("Working fine on " + process.env.PORT);
});

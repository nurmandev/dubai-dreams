import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/routes";
import dashboardRoutes from "./dashboard/routes";
import publicRoutes from "./public/routes";
import { connectDB } from "./config/db";

dotenv.config();

const app: Express = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
// CORS: explicit allowed origins + pattern matching for Vercel preview deployments
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:5173",
  "https://omnis-real-estate.vercel.app",
  "https://dubai-dreams.vercel.app",
]
  .filter(Boolean)
  .map((url) => url!.replace(/\/$/, "")); // remove trailing slashes

// Patterns to allow all Vercel preview URLs for this project
const allowedPatterns = [
  /^https:\/\/omnis-real-estate.*\.vercel\.app$/,
  /^https:\/\/dubai-dreams.*\.vercel\.app$/,
  /^https:\/\/nurmandev.*\.vercel\.app$/,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (server-to-server, curl, Postman)
      if (!origin) {
        return callback(null, true);
      }
      const cleanOrigin = origin.replace(/\/$/, "");
      if (
        allowedOrigins.includes(cleanOrigin) ||
        allowedPatterns.some((pattern) => pattern.test(cleanOrigin))
      ) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/public", express.static("public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/public", publicRoutes);

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Resource not found" });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (err.name === "MulterError") {
    return res.status(400).json({
      message: `File upload error: ${err.message}`,
    });
  }

  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

export default app;

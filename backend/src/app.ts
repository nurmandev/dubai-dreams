import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from "./auth/routes";
import dashboardRoutes from "./dashboard/routes";
import publicRoutes from "./public/routes";
import devpayRoutes from "./devpay/routes";
import { connectDB } from "./config/db";

dotenv.config();

const app: Express = express();

// Connect to Database
connectDB();

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "https://omnisprop.com",
        "https://backend.omnisprop.com",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5000",
      ];

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        // Still allow for now to debug, or you can restrict strictly
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/public", express.static("public"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/devpay", devpayRoutes);

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

// Serve static frontend files from public_html
// (Disabled now as frontend is hosted on the root domain separately)
// const frontendPath = "/home/vikasuser/public_html";
// app.use(express.static(frontendPath));

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

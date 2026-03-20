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
// CORS: Simplified to allow all origins globally (bypassing CORS issues during cPanel deployment)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow ALL origins to avoid CORS issues
      // To allow all with credentials, we return true for any origin
      callback(null, true);
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

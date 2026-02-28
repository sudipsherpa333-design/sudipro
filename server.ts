import "express-async-errors";
import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import adminRoutes from "./server/routes/admin";
import publicRoutes from "./server/routes/public";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy for rate limiting behind reverse proxies
  app.set("trust proxy", 1);

  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sudipro:sudipro9813%40%23%24@cluster0.h5be6xs.mongodb.net/portfolio?retryWrites=true&w=majority';
  let isDbConnected = false;
  
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000, // Fail fast if no DB
    });
    isDbConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.warn('MongoDB connection failed. Running in fallback mode with mock data.', err);
  }

  // Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for dev/vite
  }));
  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    validate: { xForwardedForHeader: false, default: true }
  });
  app.use("/api/", limiter);

  // Fallback middleware if DB is not connected
  app.use("/api", (req, res, next) => {
    if (!isDbConnected) {
      return res.status(503).json({ success: false, message: 'Database connection failed. Please try again later.' });
    }
    next();
  });

  // API Routes
  app.use("/api/admin", adminRoutes);
  app.use("/api", publicRoutes);

  // Catch-all for unmatched API routes to prevent HTML fallback
  app.use("/api", (req, res) => {
    res.status(404).json({ success: false, message: "API route not found" });
  });

  // Global API error handler
  app.use("/api", (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("API Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

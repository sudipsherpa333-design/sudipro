import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

// ❌ REMOVE .js extensions
import adminRoutes from "./server/routes/admin";
import publicRoutes from "./server/routes/public";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.set("trust proxy", 1);

  // ==========================
  // MongoDB Connection
  // ==========================
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  }

  // ==========================
  // Middleware
  // ==========================
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(cookieParser());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });

  app.use("/api", limiter);

  // ==========================
  // API Routes
  // ==========================
  app.use("/api/admin", adminRoutes);
  app.use("/api", publicRoutes);

  app.use("/api", (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: "API route not found",
    });
  });

  app.use(
    (
      err: any,
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      console.error("🔥 API Error:", err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  );

  // ==========================
  // Frontend Handling
  // ==========================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
// server.ts - production path fix
const distPath = path.join(__dirname, "../dist"); // go up one level
app.use(express.static(distPath));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, "index.html"));
});
  }

  // ==========================
  // Start Server
  // ==========================
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();

import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

// 🔥 Import all routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import bakeryRoutes from "./routes/bakery.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Allow frontend to connect — reads from CORS_ORIGIN in production
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// 🌐 Simple homepage
app.get("/", (_req, res) => {
  res.send(`
    <html>
      <head><title>BakeHub</title></head>
      <body style="font-family:Arial;max-width:720px;margin:40px auto;">
        <h1>🍰 BakeHub API</h1>
        <p>Your neighborhood bakery marketplace.</p>
        <ul>
          <li>Customer: browse nearby bakeries</li>
          <li>Bakery Owner: manage menu & orders</li>
          <li>Admin: approve bakeries</li>
        </ul>
        <p>API health: <a href="/api/health">/api/health</a></p>
      </body>
    </html>
  `);
});

// ❤️ Health route
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, service: "BakeHub API" })
);

// File path utilities
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "./public/uploads")));

// Register all routes
app.use("/uploads", express.static("public/uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/bakeries", bakeryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/messages", messageRoutes);

// ─── Global Express Error Handler ───────────────────────────────────────────
// Catches any error passed via next(err) or thrown in async middleware
app.use((err, req, res, _next) => {
  console.error("[Global Error]", err.message);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || "Internal server error" });
});

// ─── Process-Level Crash Guards ──────────────────────────────────────────────
// Prevent the Node process from dying on unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err.message);
  // Give the server 1s to finish in-flight requests before exiting
  setTimeout(() => process.exit(1), 1000);
});

// 🚀 Start server
const start = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
};

start();

// End of Express server configuration

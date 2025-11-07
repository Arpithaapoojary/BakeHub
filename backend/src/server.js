import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

import menuRoutes from "./routes/menu.routes.js";

import productRoutes from "./routes/product.routes.js";




const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// ✅ Simple homepage content for BakeHub
app.get("/", (_req, res) => {
  res.send(`
    <html>
      <head><title>BakeHub</title></head>
      <body style="font-family:Arial;max-width:720px;margin:40px auto;">
        <h1>🍰 BakeHub</h1>
        <p>Your neighborhood bakery marketplace. Discover nearby bakeries, order online, and pick up fresh.</p>
        <ul>
          <li>Customer: browse nearby bakeries & menus</li>
          <li>Bakery Owner: manage products & orders</li>
          <li>Admin: approve bakeries</li>
        </ul>
        <p>API health: <a href="/api/health">/api/health</a></p>
      </body>
    </html>
  `);
});

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "BakeHub API" }));

// mount routes (we’ll add them next)
import authRoutes from "./routes/auth.routes.js";
import bakeryRoutes from "./routes/bakery.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/bakeries", bakeryRoutes);

app.use("/api/menu", menuRoutes);


app.use("/api/products", productRoutes);



const start = async () => {
  await connectDB();
  app.listen(process.env.PORT, () =>
    console.log(`🚀 http://localhost:${process.env.PORT}`)
  );
};
start();

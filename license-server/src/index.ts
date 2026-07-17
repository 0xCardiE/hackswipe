import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import { closeDb, getDb } from "./db.js";
import { createAdminRouter, createPublicRouter } from "./routes.js";

const PORT = Number(process.env.PORT || 3847);
const DATABASE_PATH = path.resolve(
  process.cwd(),
  process.env.DATABASE_PATH || "./data/licenses.db"
);
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!ADMIN_API_KEY) {
  console.warn("[hackswipe-license] ADMIN_API_KEY is not set. Admin routes will reject all requests.");
}

const db = getDb(DATABASE_PATH);
const app = express();

app.use(helmet());
app.use(express.json({ limit: "32kb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.length === 0) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error("Origin not allowed by CORS"));
    },
  })
);

app.get("/health", (_req, res) => {
  try {
    db.prepare("SELECT 1").get();
    res.json({
      ok: true,
      service: "hackswipe-license-server",
      version: "1.0.0",
      uptimeSeconds: Math.floor(process.uptime()),
      database: DATABASE_PATH,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      ok: false,
      service: "hackswipe-license-server",
      error: error instanceof Error ? error.message : "Database unavailable",
    });
  }
});

app.use("/api/v1/license", createPublicRouter(db));

if (ADMIN_API_KEY) {
  app.use("/admin", createAdminRouter(db, ADMIN_API_KEY));
}

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "not_found" });
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (err.message.includes("Origin not allowed")) {
      return res.status(403).json({ ok: false, error: "cors_forbidden" });
    }
    console.error("[hackswipe-license] unhandled error:", err);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
);

const server = app.listen(PORT, () => {
  console.log(`[hackswipe-license] listening on http://127.0.0.1:${PORT}`);
  console.log(`[hackswipe-license] database: ${DATABASE_PATH}`);
  console.log(`[hackswipe-license] health: http://127.0.0.1:${PORT}/health`);
});

function shutdown(signal: string) {
  console.log(`[hackswipe-license] received ${signal}, shutting down…`);
  server.close(() => {
    closeDb();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export { app, server };

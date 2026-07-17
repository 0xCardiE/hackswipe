import { Router } from "express";
import { z } from "zod";
import type Database from "better-sqlite3";
import {
  activateLicense,
  createLicense,
  deactivateLicense,
  deleteLicense,
  listLicenses,
  resetActivation,
  setLicenseStatus,
  verifyLicense,
} from "./license-service.js";

const installationIdSchema = z.string().trim().min(8).max(128);
const licenseCredentialsSchema = z.object({
  email: z.string().email().max(320),
  licenseKey: z.string().trim().min(8).max(64),
  installationId: installationIdSchema,
});

const activateSchema = licenseCredentialsSchema.extend({
  deviceLabel: z.string().trim().max(120).optional(),
});

const verifySchema = licenseCredentialsSchema;

const deactivateSchema = licenseCredentialsSchema;

const createLicenseSchema = z.object({
  email: z.string().email().max(320),
  expiresAt: z.string().datetime().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  licenseKey: z.string().trim().min(8).max(64).optional(),
});

const statusSchema = z.object({
  status: z.enum(["active", "revoked", "expired"]),
});

function reasonMessage(reason: string | undefined): string {
  switch (reason) {
    case "invalid_credentials":
      return "Email and license key do not match any paid license.";
    case "license_revoked":
      return "This license has been revoked.";
    case "license_expired":
      return "This license has expired.";
    case "already_activated_elsewhere":
      return "This license is already activated on another browser or device.";
    case "not_activated":
      return "License is valid but not activated on this installation yet.";
    case "installation_mismatch":
      return "This installation is not authorized for this license.";
    default:
      return "License check failed.";
  }
}

export function createPublicRouter(db: Database.Database): Router {
  const router = Router();

  router.post("/activate", (req, res) => {
    const parsed = activateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: "invalid_request", details: parsed.error.flatten() });
    }

    const result = activateLicense(
      db,
      parsed.data.email,
      parsed.data.licenseKey,
      parsed.data.installationId,
      parsed.data.deviceLabel
    );

    if (!result.ok) {
      return res.status(result.reason === "invalid_credentials" ? 404 : 403).json({
        ok: false,
        reason: result.reason,
        message: reasonMessage(result.reason),
      });
    }

    return res.json({
      ok: true,
      activated: result.activated ?? false,
      email: result.email,
      activatedAt: result.activatedAt,
      lastSeenAt: result.lastSeenAt,
      message: result.activated ? "License activated." : "License already active on this installation.",
    });
  });

  router.post("/verify", (req, res) => {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: "invalid_request", details: parsed.error.flatten() });
    }

    const result = verifyLicense(
      db,
      parsed.data.email,
      parsed.data.licenseKey,
      parsed.data.installationId
    );

    if (!result.ok) {
      const status =
        result.reason === "invalid_credentials" || result.reason === "not_activated" ? 404 : 403;
      return res.status(status).json({
        ok: false,
        reason: result.reason,
        message: reasonMessage(result.reason),
      });
    }

    return res.json({
      ok: true,
      email: result.email,
      activatedAt: result.activatedAt,
      lastSeenAt: result.lastSeenAt,
    });
  });

  router.post("/deactivate", (req, res) => {
    const parsed = deactivateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: "invalid_request", details: parsed.error.flatten() });
    }

    const result = deactivateLicense(
      db,
      parsed.data.email,
      parsed.data.licenseKey,
      parsed.data.installationId
    );

    if (!result.ok) {
      return res.status(result.reason === "invalid_credentials" ? 404 : 403).json({
        ok: false,
        reason: result.reason,
        message: reasonMessage(result.reason),
      });
    }

    return res.json({ ok: true, message: "License deactivated on this installation." });
  });

  return router;
}

export function createAdminRouter(db: Database.Database, adminApiKey: string): Router {
  const router = Router();

  router.use((req, res, next) => {
    const header = req.header("authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : req.header("x-admin-key");

    if (!token || token !== adminApiKey) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }

    next();
  });

  router.get("/licenses", (_req, res) => {
    return res.json({ ok: true, licenses: listLicenses(db) });
  });

  router.post("/licenses", (req, res) => {
    const parsed = createLicenseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: "invalid_request", details: parsed.error.flatten() });
    }

    try {
      const license = createLicense(db, parsed.data);
      return res.status(201).json({ ok: true, license });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not create license";
      if (message.includes("UNIQUE constraint failed")) {
        return res.status(409).json({ ok: false, error: "duplicate", message: "Email or license key already exists." });
      }
      return res.status(500).json({ ok: false, error: "server_error", message });
    }
  });

  router.patch("/licenses/:id/status", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, error: "invalid_id" });
    }

    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: "invalid_request", details: parsed.error.flatten() });
    }

    const license = setLicenseStatus(db, id, parsed.data.status);
    if (!license) {
      return res.status(404).json({ ok: false, error: "not_found" });
    }

    return res.json({ ok: true, license });
  });

  router.post("/licenses/:id/reset-activation", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, error: "invalid_id" });
    }

    const reset = resetActivation(db, id);
    if (!reset) {
      return res.status(404).json({ ok: false, error: "not_found", message: "No activation to reset." });
    }

    return res.json({ ok: true, message: "Activation reset. License can be activated on a new device." });
  });

  router.delete("/licenses/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, error: "invalid_id" });
    }

    const deleted = deleteLicense(db, id);
    if (!deleted) {
      return res.status(404).json({ ok: false, error: "not_found" });
    }

    return res.json({ ok: true, message: "License deleted." });
  });

  return router;
}

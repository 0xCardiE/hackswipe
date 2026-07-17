#!/usr/bin/env node
import "dotenv/config";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { closeDb, getDb } from "./db.js";
import {
  createLicense,
  deleteLicense,
  listLicenses,
  resetActivation,
  setLicenseStatus,
} from "./license-service.js";

const DATABASE_PATH = path.resolve(
  process.cwd(),
  process.env.DATABASE_PATH || "./data/licenses.db"
);

const db = getDb(DATABASE_PATH);

function printUsage() {
  console.log(`
HackSwipe license admin CLI

Usage:
  npm run admin -- create <email> [--expires 2026-12-31T00:00:00.000Z] [--notes "..."]
  npm run admin -- list
  npm run admin -- revoke <licenseId>
  npm run admin -- activate <licenseId>
  npm run admin -- reset <licenseId>
  npm run admin -- delete <licenseId>

Environment:
  DATABASE_PATH (default: ./data/licenses.db)
`);
}

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command || command === "help" || command === "--help") {
    printUsage();
    return;
  }

  try {
    switch (command) {
      case "create": {
        const email = args[0];
        if (!email) throw new Error("Email is required.");

        let expiresAt: string | null = null;
        let notes: string | null = null;

        for (let i = 1; i < args.length; i++) {
          if (args[i] === "--expires") expiresAt = args[++i] ?? null;
          if (args[i] === "--notes") notes = args[++i] ?? null;
        }

        const license = createLicense(db, { email, expiresAt, notes });
        console.log("License created:");
        console.log(`  id:          ${license.id}`);
        console.log(`  email:       ${license.email}`);
        console.log(`  license_key: ${license.license_key}`);
        if (license.expires_at) console.log(`  expires_at:  ${license.expires_at}`);
        break;
      }

      case "list": {
        const licenses = listLicenses(db);
        if (licenses.length === 0) {
          console.log("No licenses yet.");
          break;
        }

        for (const license of licenses) {
          console.log("---");
          console.log(`id:          ${license.id}`);
          console.log(`email:       ${license.email}`);
          console.log(`license_key: ${license.license_key}`);
          console.log(`status:      ${license.status}`);
          console.log(`created_at:  ${license.created_at}`);
          if (license.expires_at) console.log(`expires_at:  ${license.expires_at}`);
          if (license.notes) console.log(`notes:       ${license.notes}`);
          if (license.activation) {
            console.log(`activated:   yes (${license.activation.installation_id.slice(0, 12)}…)`);
            console.log(`last_seen:   ${license.activation.last_seen_at}`);
          } else {
            console.log("activated:   no");
          }
        }
        break;
      }

      case "revoke": {
        const id = Number(args[0]);
        if (!Number.isInteger(id)) throw new Error("License id is required.");
        const license = setLicenseStatus(db, id, "revoked");
        if (!license) throw new Error(`License ${id} not found.`);
        console.log(`License ${id} revoked.`);
        break;
      }

      case "activate": {
        const id = Number(args[0]);
        if (!Number.isInteger(id)) throw new Error("License id is required.");
        const license = setLicenseStatus(db, id, "active");
        if (!license) throw new Error(`License ${id} not found.`);
        console.log(`License ${id} set to active.`);
        break;
      }

      case "reset": {
        const id = Number(args[0]);
        if (!Number.isInteger(id)) throw new Error("License id is required.");
        const ok = resetActivation(db, id);
        if (!ok) throw new Error(`No activation found for license ${id}.`);
        console.log(`Activation reset for license ${id}.`);
        break;
      }

      case "delete": {
        const id = Number(args[0]);
        if (!Number.isInteger(id)) throw new Error("License id is required.");
        const confirm = await prompt(`Delete license ${id}? Type DELETE to confirm: `);
        if (confirm !== "DELETE") {
          console.log("Cancelled.");
          break;
        }
        const ok = deleteLicense(db, id);
        if (!ok) throw new Error(`License ${id} not found.`);
        console.log(`License ${id} deleted.`);
        break;
      }

      default:
        printUsage();
        process.exitCode = 1;
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    closeDb();
  }
}

main();

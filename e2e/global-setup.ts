import fs from "node:fs";
import path from "node:path";
import { testDatabasePath } from "./lib/env.js";

export default async function globalSetup(): Promise<void> {
  const dbDir = path.dirname(testDatabasePath);
  fs.mkdirSync(dbDir, { recursive: true });

  for (const suffix of ["", "-wal", "-shm"]) {
    const file = `${testDatabasePath}${suffix}`;
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
}

// Imports
// =================================
import { drizzle } from "drizzle-orm/node-postgres";
import Database from "pg";
import { env } from "@/env";
import * as schema from './schema';

// Config
// =================================
const pg = new Database.Pool({
  connectionString: env.DATABASE_URL
});
const db = drizzle(pg, { schema });

// Exports
// =================================
export default db;
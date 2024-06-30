// Imports
// =================================
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import db from "@/lib/db/index";
import { sessionTable, userTable } from "@/lib/db/schema";

// Adapter Configuration
// =================================
const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

// Exports
// =================================
export default adapter;
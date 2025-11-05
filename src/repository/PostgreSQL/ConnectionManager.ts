import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

let pool: Pool;

if (process.env.NODE_ENV !== "test") {
  // Normal mode: connect to the real DB
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  // Test mode: provide a mockable dummy object
  pool = {
    connect: async () => ({
      query: jest.fn(),
      release: jest.fn(),
    }),
  } as unknown as Pool;
}

export default pool;

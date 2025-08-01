import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
<<<<<<< HEAD
dotenv.config();

let db;

try {
  db = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });
  console.log("✅ Database connected successfully!");
} catch (err) {
  console.error("❌ Failed to connect to database:", err.message);
}

export { db };
=======

dotenv.config(); // Load .env

export const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
>>>>>>> e9717a5 (Implement responsive layout and sidebar scroll fix)

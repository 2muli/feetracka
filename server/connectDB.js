import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
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

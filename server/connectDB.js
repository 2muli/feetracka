import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();
// Create a connection using the promise-based wrapper
export const db = await mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

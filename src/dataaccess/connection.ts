import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export async function connectMySQL() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
}

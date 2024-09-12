import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export async function connectMySQL() {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });
}

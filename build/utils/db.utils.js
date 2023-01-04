import mysql from "mysql2/promise";
import dbConfig from "../config/db.config.js";
/**
 * the pool used for queing requests to the database
 */
const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
});
export default pool;

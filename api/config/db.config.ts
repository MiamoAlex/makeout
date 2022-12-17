import "dotenv/config";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "makeout",
  password: process.env.DB_PASSWORD || "makeout",
  database: process.env.DB_NAME || "makeout",
  port: process.env.DB_PORT || 3306,
};

export default dbConfig;
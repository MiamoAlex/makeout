import "dotenv/config";

const appConfig = {
  PORT: process.env.PORT || 3002,
  JWT_SECRET: process.env.JWT_SECRET || "secret",
};

export default appConfig;
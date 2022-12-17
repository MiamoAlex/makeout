import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./routes/";

import appConfig from "./config/app.config";
import dbConfig from "./config/db.config";

// log the configuration of the server  
console.group()
console.log("\n Global Config")
console.table(appConfig)

console.log("\n DataBase Config")
console.table(dbConfig)
console.groupEnd()


// instanciate an express server
const app: Express = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", router.apiRouter);
app.use("/", router.webRouter);

// define the port
app.listen(appConfig.PORT, () => {
  console.log(`\n Server is running on port ${appConfig.PORT}`);
});
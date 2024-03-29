import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from 'http';
import { Server } from "socket.io";
import router from "./routes/index.js";
import appConfig from "./config/app.config.js";
import dbConfig from "./config/db.config.js";
import SocketService from "./services/socket.service.js";
// log the configuration of the server  
console.group();
console.log("\n Global Config");
console.table(appConfig);
console.log("\n DataBase Config");
console.table(dbConfig);
console.groupEnd();
// instanciate an express server
const app = express();
const server = http.createServer(app);
SocketService.setInstance(new Server(server));
// express middlewares
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "25mb"  }));
// express routes
app.use("/api", router.apiRouter);
app.use("/", router.webRouter);
// define the port
server.listen(appConfig.PORT, () => {
    console.log(`\n Server is running on port ${appConfig.PORT}`);
});

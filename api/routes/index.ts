import express from "express";
import authRouter from "./auth.route";
import appRouter from "./app.route";
import loverRouter from "./lover.route";
export const apiRouter = express.Router();

apiRouter.use("/", authRouter);
apiRouter.use("/", loverRouter);

apiRouter.all("/isWorking", (req, res) => {
  res.json(true);
});


// WEB APP

export const webRouter = express.Router();

webRouter.use('/', express.static('public'));
webRouter.use("/", appRouter);


export default {apiRouter, webRouter};
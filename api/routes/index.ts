import express from "express";
import authRouter from "./auth.route";
import appRouter from "./app.route";
import loverRouter from "./lover.route";
import messageRouter from "./message.route";
import morgan from "morgan";
export const apiRouter = express.Router();

apiRouter.use(morgan("tiny"));

apiRouter.use('/', authRouter);
apiRouter.use('/', loverRouter);
apiRouter.use('/', messageRouter);

apiRouter.all("/isWorking", (req, res) => {
  res.json(true);
});

// WEB APP

export const webRouter = express.Router();

webRouter.use('/data', express.static('data'));
webRouter.use('/', express.static('public'));
webRouter.use('/', appRouter);


export default {apiRouter, webRouter};
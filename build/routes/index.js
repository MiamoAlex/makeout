import express from "express";
import authRouter from "./auth.route.js";
import appRouter from "./app.route.js";
import loverRouter from "./lover.route.js";
import messageRouter from "./message.route.js";
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
export default { apiRouter, webRouter };

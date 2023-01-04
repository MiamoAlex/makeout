import express from "express";
const router = express.Router();
import { getLovers, rejectLovers, acceptLovers, editLover } from "../controllers/lover.controller.js";
import { checkTokenMiddleware } from "../middlewares/auth.middleware.js";
router.get("/getlovers", checkTokenMiddleware, getLovers);
router.put("/rejectlovers/:id", checkTokenMiddleware, rejectLovers);
router.put("/acceptlovers/:id", checkTokenMiddleware, acceptLovers);
router.put("/editprofile", checkTokenMiddleware, editLover);
export default router;

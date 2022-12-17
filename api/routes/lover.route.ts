import express from "express";
const router = express.Router();
import { getLovers, rejectLovers, acceptLovers } from "../controllers/lover.controller";
import { checkTokenMiddleware } from "../middlewares/auth.middleware"; 

router.get("/getLovers", checkTokenMiddleware, getLovers);
router.put("/rejectLovers/:id", checkTokenMiddleware, rejectLovers);
router.put("/acceptLovers/:id", checkTokenMiddleware, acceptLovers);

export default router;
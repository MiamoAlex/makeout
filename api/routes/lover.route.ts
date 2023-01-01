import express from "express";
const router = express.Router();
import { getLovers, rejectLovers, acceptLovers, editLover } from "../controllers/lover.controller";
import { checkTokenMiddleware } from "../middlewares/auth.middleware"; 

router.get("/getLovers", checkTokenMiddleware, getLovers);
router.put("/rejectLovers/:id", checkTokenMiddleware, rejectLovers);
router.put("/acceptLovers/:id", checkTokenMiddleware, acceptLovers);
router.put("/editprofile", checkTokenMiddleware, editLover);

export default router;
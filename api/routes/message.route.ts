import express from "express";
const router = express.Router();
import { sendMessage, getMessage, getChats } from "../controllers/message.controller";
import { checkTokenMiddleware } from "../middlewares/auth.middleware";

router.put("/sendmessage/:id", checkTokenMiddleware, sendMessage);
router.get("/getusermessages/:id", checkTokenMiddleware, getMessage);
router.get("/getchats", checkTokenMiddleware, getChats);


export default router;
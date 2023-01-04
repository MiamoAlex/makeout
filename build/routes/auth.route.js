import express from "express";
const router = express.Router();
import { login, signup, signout, checkIn } from "../controllers/auth.controller";
router.post("/login", login);
router.post("/signup", signup);
router.get("/signout", signout);
router.post("/checkin", checkIn);
export default router;

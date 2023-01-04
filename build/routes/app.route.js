import express from "express";
const router = express.Router();
import { loadApp } from "../controllers/app.controller";
router.get("/", loadApp);
export default router;

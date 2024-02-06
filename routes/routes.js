import { Router } from "express";
import controller from "../controllers/controller.js";

const router = Router();

router.get("/", controller.getStart);

router.post("/postStart", controller.postStart);

export default router;
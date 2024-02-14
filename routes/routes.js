import { Router } from "express";
import controller from "../controllers/controller.js";

const router = Router();

router.get("/", controller.getOnboarding);
router.get("/signup", controller.getSignup);
router.get("/login", controller.getLogin);
//router.get("/", controller.getHome);
router.get("/bag", controller.getBag);
router.get("/notification", controller.getNotif);
router.get("/addbag", controller.getAddBag);
router.get("/additem", controller.getAddItem);
router.get("/itemgallery", controller.getItemGallery);


export default router;
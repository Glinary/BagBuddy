// import { Router } from "express";
// import controller from "../controllers/controller.js";

const { Router } = require('express');
const controller = require('../controllers/controller.js');

const router = Router();

router.get("/", controller.getOnboarding);
router.get("/register", controller.getRegister);
router.get("/login", controller.getLogin);
router.get("/profile", controller.getProfile);
router.get("/editprofile", controller.getEditProfile);
router.get("/home", controller.getHome);
router.get("/bag", controller.getBag);
router.get("/notification", controller.getNotif);
router.get("/addbag", controller.getAddBag);
router.get("/additem", controller.getAddItem);
router.get("/itemgallery", controller.getItemGallery);

router.post("/register", controller.postRegister);

// export default router;
module.exports = router;
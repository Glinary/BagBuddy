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

router.post("/register/isNameValid", controller.isNameValid);
router.post("/register/isEmailValid", controller.isEmailValid);
router.post("/register/newUserRegistration", controller.newUserRegistration);

router.post("/postlogin", controller.postLogin);

// export default router;
module.exports = router;
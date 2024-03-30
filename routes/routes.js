// import { Router } from "express";
// import controller from "../controllers/controller.js";

const { Router } = require("express");
const controller = require("../controllers/controller.js");

const router = Router();

router.get("/home/:id", controller.getHome);
router.get("/bag/:user/:id", controller.getBag);
router.get("/notification", controller.getNotif);
router.get("/addbag/:id", controller.getAddBag);
router.get("/additem/:id", controller.getAddItem);
router.get("/itemgallery", controller.getItemGallery);
router.get("/editbag/:user/:id", controller.getBagFormEdit);

router.post("/ab/:id", controller.addTheBag);
router.post("/fb", controller.findBag);
router.post("/db/:id", controller.deleteBag);
router.post("/eb", controller.editBag);
router.post("/ai", controller.addItem);
router.post("/fi", controller.findItem);

router.get("/", controller.getOnboarding);
router.get("/register", controller.getRegister);
router.get("/login", controller.getLogin);
router.get("/profile", controller.getProfile);
router.get("/editprofile", controller.getEditProfile);

router.post("/register/isNameValid", controller.isNameValid);
router.post("/register/isEmailValid", controller.isEmailValid);
router.post("/postRegister", controller.postRegister);

router.post("/postlogin", controller.postLogin);
router.post("/postSignout", controller.postSignout);

// export default router;
module.exports = router;

// import { Router } from "express";
// import controller from "../controllers/controller.js";

const { Router } = require("express");
const controller = require("../controllers/controller.js");

const router = Router();

router.get("/home", controller.getHome);
router.get("/bag/:id", controller.getBag);
router.get("/notification", controller.getNotif);
router.get("/addbag", controller.getAddBag);
router.get("/additem/:id", controller.getAddItem);
router.get("/itemgallery/:id", controller.getItemGallery);
router.get("/editbag/:id", controller.getBagFormEdit);

router.post("/ab", controller.addTheBag);
router.post("/fb", controller.findBag);
router.post("/db", controller.deleteBag);
router.post("/di", controller.deleteItem);
router.post("/eb", controller.editBag);
router.post("/ai", controller.addItem);
router.post("/fbi", controller.findBagItem);
router.post("/fi", controller.findItem);
router.post("/aig", controller.addItemGallery);
router.post("/udb", controller.updateItemGallery);

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

router.post("/getbags", controller.getBagList);

// export default router;
module.exports = router;

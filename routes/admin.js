const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admincontroller");


router.get("/login", adminController.login);
router.post("/login", adminController.loginpost);
router.get("/home", adminController.home);
router.post("/logout", adminController.logout);
router.get("/edit/:id", adminController.getEditPage);
router.post("/edit/:id", adminController.useredit);
router.get("/delete/:id", adminController.userdelete);
router.get("/createuser", adminController.createuser);
router.post("/createuser", adminController.createuserpost);


module.exports = router;

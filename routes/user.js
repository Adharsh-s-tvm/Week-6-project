const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/signup", userController.signup);
router.post("/signup", userController.signuppost);
router.get("/login", userController.login);
router.post("/login", userController.loginpost);
router.get("/home", userController.home);
router.post("/home", userController.logout);

module.exports = router;

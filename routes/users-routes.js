const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users-controller");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");

router.get("/", usersController.getUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 5 }),
  ],
  usersController.createUser
);

router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 5 })],
  usersController.loginUser
);

module.exports = router;

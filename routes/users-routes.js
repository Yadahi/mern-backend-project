const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users-controller");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");

router.get("/", usersController.getUsers);

router.post(
  "/signup",
  // It indicates that this middleware will handle single file uploads, where the form field name is "image".
  // When a request is made to this route, fileUpload.single("image") processes the file upload, making the uploaded file available in req.file.
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

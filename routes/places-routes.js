const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.json({ message: "This is the places page." });
});

module.exports = router;

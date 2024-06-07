const express = require("express");

const router = express.Router();
const placesController = require("../controllers/places-controller");

router.get("/:pid", placesController.getPlaceById);

router.get("/user/:uid", placesController.getPlaceByUserId);

router.post("/", placesController.createPlace);

module.exports = router;

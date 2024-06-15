const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");

const Place = require("../models/place");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/399px-Empire_State_Building_%28aerial_view%29.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  try {
    const place = await Place.findById(placeId);

    if (!place) {
      const error = new HttpError(
        "Could not find a place for the provided id.",
        404
      );
      return next(error);
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  try {
    const places = await Place.find({ creator: userId });
    if (!places || places.length === 0) {
      const error = new HttpError(
        "Could not find a place for the provided user id.",
        404
      );
      return next(error);
    }

    res.status(200).json({
      places: places.map((place) => place.toObject({ getters: true })),
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/399px-Empire_State_Building_%28aerial_view%29.jpg",
    creator,
  });

  try {
    const result = await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  return res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const placeId = req.params.pid;
  if (!placeId) {
    return next(new HttpError("Invalid data sent", 400));
  }

  try {
    const updatePlace = await Place.findById(placeId);
    if (!updatePlace) {
      const error = new HttpError(
        "Could not find a place for the provided id.",
        404
      );
      return next(error);
    }

    const { title, description } = req.body;

    updatePlace.title = title;
    updatePlace.description = description;

    await updatePlace.save();

    return res
      .status(200)
      .json({ place: updatePlace.toObject({ getters: true }) });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }
};

/**
 * Deletes a place with the specified ID from the database.
 *
 * @async
 * @function deletePlace
 * @param {Object} req - The request object containing the place ID.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves to nothing.
 */
const deletePlace = async (req, res, next) => {
  // Get the place ID from the request params
  const placeId = req.params.pid;

  try {
    // Find the place with the specified ID and delete it from the database
    const deletePlace = await Place.findByIdAndDelete(placeId);

    // If no place was found with the specified ID, return a 404 error
    if (!deletePlace) {
      const error = new HttpError(
        "Could not find a place for the provided id.",
        404
      );
      return next(error);
    }

    // If the place was successfully deleted, return a 200 message
    return res.status(200).json({ message: "Deleted place" });
  } catch (err) {
    // If an error occurred while deleting the place, return a 500 error
    const error = new HttpError(
      "Could not delete the place, please try again later.",
      500
    );
    return next(error);
  }
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};

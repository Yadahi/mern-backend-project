const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const mongoose = require("mongoose");
const fs = require("fs");

const Place = require("../models/place");
const User = require("../models/user");

/**
 * This function handles the HTTP GET request to retrieve a place by its ID.
 *
 * @async
 * @function getPlaceById
 * @param {Object} req - The request object containing the place ID.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves to nothing.
 */
const getPlaceById = async (req, res, next) => {
  // Get the place ID from the request parameters
  const placeId = req.params.pid;

  try {
    // Find the place with the specified ID in the database
    const place = await Place.findById(placeId);

    // If the place does not exist, throw a 404 error
    if (!place) {
      const error = new HttpError(
        "Could not find a place for the provided id.",
        404
      );
      return next(error);
    }

    // Convert the place object to a plain JavaScript object with the `getters` option set to true
    const placeAsObject = place.toObject({ getters: true });

    // Send a JSON response with the place object
    res.status(200).json({ place: placeAsObject });
  } catch (err) {
    // If an error occurs while retrieving the place, throw a 500 error
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }
};

/**
 * This function handles the HTTP GET request to retrieve all places
 * created by a specific user.
 * It expects a request parameter `uid` with the ID of the user.
 * It first tries to find all places in the database that have the
 * specified user ID as their creator.
 * If no places are found or an error occurs, it returns a 404 error.
 * If places are found, it returns a JSON response with the places.
 * Each place is converted to a plain JavaScript object using the
 * `toObject` method with the `getters` option set to true.
 *
 * @async
 * @function getPlacesByUserId
 * @param {Object} req - The request object containing the user ID.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves to nothing.
 */
const getPlacesByUserId = async (req, res, next) => {
  // Get the user ID from the request parameters
  const userId = req.params.uid;

  let userWithPlaces;
  try {
    // Find all places in the database that have the specified user ID as their creator
    userWithPlaces = await User.findById(userId).populate("places");

    // If no places are found, return a 404 error
    if (!userWithPlaces || userWithPlaces.length === 0) {
      const error = new HttpError(
        "Could not find a place for the provided user id.",
        404
      );
      return next(error);
    }

    // Convert each place to a plain JavaScript object with the `getters` option set to true
    const placesAsObjects = userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    );

    // Return a JSON response with the places
    res.status(200).json({
      places: placesAsObjects,
    });
  } catch (err) {
    // If an error occurs, return a 500 error
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }
};

/**
 * This function handles the HTTP POST request to create a new place.
 * It expects a request body with the title, description, address, and creator
 * of the new place.
 * It first checks if the request is valid. If the request is valid, it
 * retrieves the coordinates for the address using the getCoordsForAddress
 * function. It then creates a new Place object with the provided data and saves
 * it to the database. It sends a JSON response with the newly created place
 * object.
 *
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function.
 */
const createPlace = async (req, res, next) => {
  // Check if the request is valid
  const errors = validationResult(req);

  // If the request is not valid, return an error
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  // Extract the data from the request body
  const { title, description, address, creator } = req.body;

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    // Retrieve the coordinates for the address
    const coordinates = await getCoordsForAddress(address);

    // Create a new Place object with the provided data
    const createdPlace = new Place({
      title,
      description,
      address,
      location: coordinates,
      image: req.file.path,
      creator,
    });

    const sess = await mongoose.startSession();
    // console.log(sess);
    sess.startTransaction();
    // Save the new place to the database
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();

    // Send a JSON response with the newly created place object
    return res
      .status(201)
      .json({ place: createdPlace.toObject({ getters: true }) });
  } catch (err) {
    // If an error occurs, return an error
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }
};

/**
 * This function handles the HTTP PUT request to update a place.
 * It expects a request body with the new title and description of the place.
 * It first checks if the request is valid and if the place exists in the database.
 * If the request is valid and the place exists, it updates the title and description
 * of the place and saves the changes to the database. It then sends a JSON response
 * with the updated place object.
 *
 * @async
 * @function updatePlace
 * @param {Object} req - The request object containing the place ID and updated title and description.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves to nothing.
 */
const updatePlace = async (req, res, next) => {
  // Validate the request body
  const errors = validationResult(req);

  // If the request body is invalid, return a 422 error
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  // Get the place ID from the request parameters
  const placeId = req.params.pid;

  try {
    // Find the place with the specified ID in the database
    const place = await Place.findById(placeId);

    // If the place does not exist, return a 404 error
    if (!place) {
      const error = new HttpError(
        "Could not find a place for the provided id.",
        404
      );
      return next(error);
    }

    if (place.creator.toString() !== req.userData.userId) {
      const error = new HttpError(
        "You are not allowed to delete this place.",
        401
      );
      return next(error);
    }

    // Get the new title and description from the request body
    const { title, description } = req.body;

    // Update the title and description of the place
    place.title = title;
    place.description = description;

    // Save the changes to the database
    await place.save();

    // Send a JSON response with the updated place object
    return res.status(200).json({ place: place.toObject({ getters: true }) });
  } catch (err) {
    // If an error occurred while updating the place, return a 500 error
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

  // Find the place with the specified ID and delete it from the database
  let deletePlace;
  try {
    // Include the 'creator' field in the populated document
    deletePlace = await Place.findById(placeId).populate("creator");
  } catch (err) {
    // If an error occurred while finding the place, return a 500 error
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  // If the place does not exist, return a 404 error
  if (!deletePlace) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }

  if (deletePlace.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this place.",
      401
    );
    return next(error);
  }

  const imagePath = deletePlace.image;

  try {
    // Start a database transaction
    const sess = await mongoose.startSession();
    sess.startTransaction();

    // Delete the place from the database
    await deletePlace.deleteOne({ session: sess });

    // Remove the deleted place from the creator's 'places' array
    deletePlace.creator.places.pull(deletePlace);

    // Save the updated creator document to the database
    await deletePlace.creator.save({ session: sess });

    // Commit the transaction
    await sess.commitTransaction();

    fs.unlink(imagePath, (err) => {
      console.log(err);
    });

    // Return a 200 message indicating that the place was successfully deleted
    return res.status(200).json({ message: "Deleted place" });
  } catch (err) {
    // If an error occurred while deleting the place, log the error and return a 500 error
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

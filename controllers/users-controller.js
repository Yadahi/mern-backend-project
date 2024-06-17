const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  try {
    // Retrieve all users from the database, excluding the 'password' field
    const users = await User.find({}, "-password");

    // Convert each user document to a plain JavaScript object with the 'getters' option set to true
    const usersAsObjects = users.map((user) =>
      user.toObject({ getters: true })
    );

    // Send a JSON response with the array of users
    res.status(200).json({ users: usersAsObjects });
  } catch (err) {
    // If an error occurs, create a new HttpError object and pass it to the next middleware
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
};

/**
 * Asynchronously creates a new user from the request body.
 * Checks if the user already exists, and if not, creates a new user
 * with the provided name, email, password, and an empty list of places.
 * If successful, returns a JSON response with the created user object.
 * If unsuccessful, returns an HTTP error with an appropriate status code.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<void>} - Returns a Promise that resolves when the user is created.
 *                          If there is an error, it calls the next middleware function.
 */
const createUser = async (req, res, next) => {
  // Check if any validation errors were found in the request body.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are errors, create a new HttpError object and pass it to the next middleware.
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  // Extract the name, email, and password from the request body.
  const { name, email, password } = req.body;

  try {
    // Look for a user with the same email in the database.
    const existingUser = await User.findOne({ email });

    // If a user with the same email is found, create a new HttpError object and pass it to the next middleware.
    if (existingUser) {
      const error = new HttpError(
        "User exists already, please login instead.",
        422
      );
      return next(error);
    }

    // Create a new user object with the provided name, email, password, and an empty list of places.
    const createdUser = new User({
      name,
      email,
      // Use a default image URL for the user's profile picture.
      image: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
      password,
      places: [],
    });

    // Save the new user to the database.
    await createdUser.save();
    // Return a JSON response with the created user object.
    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  } catch (err) {
    // If it is not a validation error, create a new HttpError object and pass it to the next middleware.
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
};

/**
 * Asynchronously logs in a user based on the email and password provided in the request body.
 * If the user does not exist or the password is incorrect, returns an HTTP error with an appropriate status code.
 * If the user exists and the password is correct, returns a JSON response with a success message.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<void>} - Returns a Promise that resolves when the user is logged in.
 *                          If there is an error, it calls the next middleware function.
 */
const loginUser = async (req, res, next) => {
  // Check if any validation errors were found in the request body.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are errors, create a new HttpError object and pass it to the next middleware.
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  // Extract the email and password from the request body.
  const { email, password } = req.body;

  try {
    // Look for a user with the same email in the database.
    const existingUser = await User.findOne({ email });

    // If the user does not exist or the password is incorrect, create a new HttpError object and pass it to the next middleware.
    if (!existingUser || existingUser.password !== password) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        401
      );
      return next(error);
    }

    // If the user exists and the password is correct, return a JSON response with a success message.
    res.json({ message: "Logged in" });
  } catch (err) {
    // If it is not a validation error, create a new HttpError object and pass it to the next middleware.
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  loginUser,
};

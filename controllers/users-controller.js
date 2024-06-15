const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Max",
    email: "I8Z7T@example.com",
    password: "test123",
  },
  {
    id: "u2",
    name: "Manuel",
    email: "I8Z7T@example.com",
    password: "test321",
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
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
  const { name, email, password, places } = req.body;

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
      places,
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

const loginUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new HttpError("Invalid data sent", 400));
  }

  const foundUser = DUMMY_USERS.find((u) => u.email === email);
  if (!foundUser || foundUser.password !== password) {
    return next(
      new HttpError("Could not find a user for the provided email.", 401)
    );
  }

  res.json({ user: foundUser, message: "Logged in" });
};

module.exports = {
  getUsers,
  createUser,
  loginUser,
};

const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

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

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new HttpError("Invalid data sent", 400));
  }

  if (DUMMY_USERS.find((u) => u.email === email)) {
    return next(new HttpError("User already exists", 422));
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };
  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const loginUser = (req, res, next) => {
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

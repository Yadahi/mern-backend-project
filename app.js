const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const uri = `${process.env.MONGO_SCHEME}://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}/${process.env.MONGO_NAME_DATABASE}?retryWrites=true&w=majority`;

const app = express();

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const { log } = require("console");

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

/**
 * Middleware to enable Cross-Origin Resource Sharing (CORS).
 * Sets the necessary headers to allow requests from any origin and with the
 * specified methods and headers.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
app.use((req, res, next) => {
  /**
   * This line of code sets the Access-Control-Allow-Origin header in the HTTP response to *,
   * which means that any origin is allowed to access the resource. This is often used to
   * enable Cross-Origin Resource Sharing (CORS) in an Express.js application.
   */
  res.setHeader("Access-Control-Allow-Origin", "*");
  /**
   * This code snippet is setting the Access-Control-Allow-Headers header in the HTTP response.
   * It allows the specified headers (Origin, X-Requested-With, Content-Type, Accept, Authorization)
   * to be included in cross-origin requests. This is often used to enable Cross-Origin Resource
   * Sharing (CORS) in an Express.js application.
   */
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  /**
   * This code snippet is setting the Access-Control-Allow-Methods header in the HTTP response.
   * It allows the specified methods (GET, POST, PATCH, DELETE) to be included in cross-origin
   * requests. This is often used to enable Cross-Origin Resource Sharing (CORS) in an Express.js
   * application.
   */
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((err, req, res, next) => {
  if (req.file) {
    // If an image file was uploaded, remove it from the file system
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headersSent) {
    return next(err);
  }

  res
    .status(err.code || 500)
    .json({ message: err.message || "An unknown error occurred" });
});

mongoose
  .connect(uri)
  .then(
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server started on port ${process.env.PORT || 5000}`)
    )
  )
  .catch((err) => console.log(err));

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const uri = `${process.env.MONGO_SCHEME}://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}/places?retryWrites=true&w=majority`;

const app = express();

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res
    .status(err.code || 500)
    .json({ message: err.message || "An unknown error occurred" });
});

mongoose
  .connect(uri)
  .then(app.listen(5000, () => console.log("Server started on port 5000")))
  .catch((err) => console.log(err));

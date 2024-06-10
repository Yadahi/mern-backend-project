const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const uri = `${process.env.MONGO_SCHEME}://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}/places?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

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

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});

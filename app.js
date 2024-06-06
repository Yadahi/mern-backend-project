const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const placesRoutes = require("./routes/places-routes");

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);

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

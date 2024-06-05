const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const placesRoutes = require("./routes/places-routes");

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});

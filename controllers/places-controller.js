const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }
  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }
  return res.json({ places });
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createPlace = {
    id: uuidv4(),
    title,
    description,
    coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createPlace);
  return res.status(201).json({ place: createPlace });
};

const updatePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!placeId) {
    return next(new HttpError("Invalid data sent", 400));
  }

  const updatePlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  if (!updatePlace) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }

  const { title, description } = req.body;

  updatePlace.title = title;
  updatePlace.description = description;

  DUMMY_PLACES[placeIndex] = updatePlace;

  return res.status(200).json({ place: updatePlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!placeId) {
    return next(new HttpError("Invalid data sent", 400));
  }
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  if (placeIndex === -1) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }
  DUMMY_PLACES.splice(placeIndex, 1);

  return res.status(200).json({ message: "Deleted place" });
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};

const HttpError = require("../models/http-error");

const API_KEY = process.env.LOCATIONIO_TOKEN;

const getCoordsForAddress = async (address) => {
  if (!address) {
    throw new HttpError("Address is required", 400);
  }

  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(
        address
      )}&format=json`
    );

    if (!response.ok) {
      throw new HttpError(`Failed to fetch data for address: ${address}`, 404);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new HttpError(
        `No data found for the given address: ${address}`,
        404
      );
    }

    const { lat, lon } = data[0];

    if (!lat || !lon) {
      throw new HttpError(`Invalid coordinates for address: ${address}`, 422);
    }

    return { lat, lng: lon };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(
      `Failed to get coordinates for address: ${address}. Error: ${error.message} `,
      500
    );
  }
};

module.exports = getCoordsForAddress;

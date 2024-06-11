- [Mongoose Overview](#mongoose-overview)
- [Schema and Model](#schema-and-model)
- [Example](#example)
- [Summary](#summary)
- [Example](#example-1)
- [Custom Collection Name](#custom-collection-name)
- [Example with Custom Collection Name](#example-with-custom-collection-name)
- [Summary](#summary-1)
- [Creating a New Document](#creating-a-new-document)
- [Saving the Document](#saving-the-document)
- [Full Example](#full-example)
- [Summary](#summary-2)

### Mongoose Overview

Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straightforward, schema-based solution to model your application data, enabling robust data validation, type checking, and built-in query capabilities.

### Schema and Model

1. **Schema**:

   - Defines the structure of the documents within a MongoDB collection.
   - Specifies the fields, their data types, and validation rules.

2. **Model**:
   - A constructor compiled from a Schema definition.
   - Instances of a Model represent documents that can be saved and retrieved from the database.
   - Provides methods for CRUD (Create, Read, Update, Delete) operations.

### Example

Here's a basic example of how to use Mongoose to define a schema and create a model.

1. **Install Mongoose**:

   ```bash
   npm install mongoose
   ```

2. **Define Schema and Model**:

   ```javascript
   const mongoose = require("mongoose");

   // Connect to MongoDB
   mongoose.connect("mongodb://localhost:27017/places", {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   });

   // Define a Schema
   const placeSchema = new mongoose.Schema({
     title: { type: String, required: true },
     description: { type: String, required: true },
     address: { type: String, required: true },
     location: {
       lat: { type: Number, required: true },
       lng: { type: Number, required: true },
     },
     creator: { type: String, required: true },
   });

   // Create a Model
   const Place = mongoose.model("Place", placeSchema);

   // Create and Save a New Place
   const createPlace = async () => {
     const place = new Place({
       title: "Empire State Building",
       description: "One of the most famous sky scrapers in the world!",
       address: "20 W 34th St, New York, NY 10001",
       location: { lat: 40.7484405, lng: -73.9878584 },
       creator: "u1",
     });

     try {
       const result = await place.save();
       console.log("Place Created:", result);
     } catch (error) {
       console.error("Error creating place:", error);
     }
   };

   createPlace();
   ```

### Summary

- **Schema**: Defines the structure and validation rules for documents.
- **Model**: Provides an interface for interacting with the database using the defined schema.
- **Example**: Connects to MongoDB, defines a schema, creates a model, and saves a new document.

This setup helps ensure your data adheres to a consistent structure and provides powerful methods to interact with your MongoDB collections.

In Mongoose, the name you provide when creating a model (`'Place'` in this case) is used by Mongoose to automatically determine the name of the collection in your MongoDB database. Mongoose will pluralize this name and convert it to lowercase.

So, for `const Place = mongoose.model('Place', placeSchema);`, Mongoose will create a collection named `places` in your MongoDB database.

### Example

Here's the process broken down:

1. **Model Name**: `'Place'`
2. **Collection Name**: Mongoose converts `'Place'` to lowercase and pluralizes it, resulting in `'places'`.

### Custom Collection Name

If you want to specify a custom collection name, you can provide it as a third argument to the `model` method:

```javascript
const Place = mongoose.model("Place", placeSchema, "myCustomCollection");
```

In this example, the collection will be named `myCustomCollection` instead of the default `places`.

### Example with Custom Collection Name

```javascript
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/places", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a Schema
const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: String, required: true },
});

// Create a Model with a custom collection name
// Use the model to create, read, update, and delete documents in the collection.
const Place = mongoose.model("Place", placeSchema, "myCustomCollection");

// Create and Save a New Place
const createPlace = async () => {
  const place = new Place({
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    address: "20 W 34th St, New York, NY 10001",
    location: { lat: 40.7484405, lng: -73.9878584 },
    creator: "u1",
  });

  try {
    const result = await place.save();
    console.log("Place Created:", result);
  } catch (error) {
    console.error("Error creating place:", error);
  }
};

createPlace();
```

### Summary

- **Default Collection Name**: Mongoose pluralizes and converts the model name to lowercase (e.g., `'Place'` becomes `places`).
- **Custom Collection Name**: You can specify a custom name by providing a third argument to the `model` method.

### Creating a New Document

When you create a new instance of a Mongoose model, you're creating a new document that adheres to the structure defined by the schema. This instance can then be saved to the corresponding collection in the MongoDB database.

Here's a breakdown of the process:

1. **Create an Instance**:

   - `const place = new Place({...});`
   - This creates a new instance of the `Place` model, which represents a document.

2. **Set Document Properties**:
   - The properties of the instance (e.g., `title`, `description`, `address`, `location`, `creator`) are set according to the schema.

### Saving the Document

3. **Save to Collection**:
   - `await place.save();`
   - This method saves the document to the MongoDB collection (`places` in this case).

### Full Example

Here’s a complete example that demonstrates creating and saving a new document:

```javascript
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/places", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a Schema
const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: String, required: true },
});

// Create a Model
const Place = mongoose.model("Place", placeSchema);

// Create and Save a New Place
const createPlace = async () => {
  // Create a new instance of the Place model
  const place = new Place({
    title: "Empire State Building",
    description: "One of the most famous skyscrapers in the world!",
    address: "20 W 34th St, New York, NY 10001",
    location: { lat: 40.7484405, lng: -73.9878584 },
    creator: "u1",
  });

  try {
    // Save the new document to the collection
    const result = await place.save();
    console.log("Place Created:", result);
  } catch (error) {
    console.error("Error creating place:", error);
  }
};

createPlace();
```

### Summary

- **Creating an Instance**: `new Place({...})` creates a new document instance of the `Place` model.
- **Setting Properties**: The document's properties are set according to the schema.
- **Saving to Database**: `await place.save()` saves the document to the corresponding MongoDB collection (`places`).

This process ensures that the document is created and stored in the database, adhering to the defined schema structure and validations.

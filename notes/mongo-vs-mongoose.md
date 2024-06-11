Certainly! Let's show how to connect to a MongoDB database and save a new instance of a product using both Mongoose and the native MongoDB driver.

### Using Mongoose

1. **Install Mongoose**:

   ```bash
   npm install mongoose
   ```

2. **Connection and Saving a New Product**:

   ```javascript
   const mongoose = require("mongoose");

   // Define the connection URI
   const uri = `${process.env.MONGO_SCHEME}://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}/products?retryWrites=true&w=majority`;

   // Connect to MongoDB
   mongoose
     .connect(uri, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
     })
     .then(() => {
       console.log("Connected to MongoDB with Mongoose");
     })
     .catch((error) => {
       console.error("Error connecting to MongoDB with Mongoose:", error);
     });

   // Define a Schema
   const productSchema = new mongoose.Schema({
     name: { type: String, required: true },
     price: { type: Number, required: true },
     description: { type: String, required: true },
   });

   // Create a Model
   const Product = mongoose.model("Product", productSchema);

   // Create and Save a New Product
   const createProduct = async () => {
     const product = new Product({
       name: "Sample Product",
       price: 19.99,
       description: "This is a sample product.",
     });

     try {
       const result = await product.save();
       console.log("Product Created:", result);
     } catch (error) {
       console.error("Error creating product:", error);
     }
   };

   createProduct();
   ```

### Using Native MongoDB Driver

1. **Install MongoDB Driver**:

   ```bash
   npm install mongodb
   ```

2. **Connection and Saving a New Product**:

   ```javascript
   const { MongoClient } = require("mongodb");

   // Define the connection URI
   const uri = `${process.env.MONGO_SCHEME}://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}/products?retryWrites=true&w=majority`;

   // Create a new MongoClient
   const client = new MongoClient(uri, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   });

   const createProduct = async () => {
     try {
       // Connect to the database
       await client.connect();
       console.log("Connected to MongoDB with Native Driver");

       // Get the database and collection
       const db = client.db();
       const productsCollection = db.collection("products");

       // Define the new product
       const newProduct = {
         name: "Sample Product",
         price: 19.99,
         description: "This is a sample product.",
       };

       // Insert the new product
       const result = await productsCollection.insertOne(newProduct);
       console.log("Product Created:", result);
     } catch (error) {
       console.error("Error creating product:", error);
     } finally {
       // Close the connection
       await client.close();
     }
   };

   createProduct();
   ```

### Summary

- **Mongoose**: Provides a schema-based approach with built-in validation, and abstracts much of the lower-level details.
- **Native MongoDB Driver**: Offers direct interaction with MongoDB, requiring more manual handling but providing fine-grained control.

Both examples achieve the same goal: connecting to a MongoDB database and inserting a new document, but they do so in different ways suitable for different use cases.

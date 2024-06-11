- [Documentation: Using Mongoose to Connect to MongoDB and Start an Express Server](#documentation-using-mongoose-to-connect-to-mongodb-and-start-an-express-server)
  - [Step-by-Step Breakdown](#step-by-step-breakdown)
- [Complete Example](#complete-example)
- [What Does It Do?](#what-does-it-do)
- [Summary](#summary)

### Documentation: Using Mongoose to Connect to MongoDB and Start an Express Server

This section explains how to use Mongoose to connect to a MongoDB database and start an Express server. We will break down the purpose and usage of each part of the code.

#### Step-by-Step Breakdown

1. **Import Mongoose**:

   - Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straightforward, schema-based solution to model your application data.

   ```javascript
   const mongoose = require("mongoose");
   ```

2. **Define Connection URI**:

   - Construct the MongoDB connection URI using environment variables. This ensures that sensitive information like database credentials is not hard-coded and can be managed securely.

   ```javascript
   const uri = `${process.env.MONGO_SCHEME}://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}/places?retryWrites=true&w=majority`;
   ```

   - `process.env.MONGO_SCHEME`: The scheme to use (`mongodb` or `mongodb+srv` for MongoDB Atlas).
   - `process.env.MONGO_USER`: The MongoDB user.
   - `process.env.MONGO_PASSWORD`: The password for the MongoDB user.
   - `process.env.MONGO_HOSTNAME`: The hostname of the MongoDB server.
   - `places`: The name of the database.
   - `retryWrites=true&w=majority`: Optional connection options.

3. **Connect to MongoDB and Start the Server**:

   - Use `mongoose.connect` to establish a connection to the MongoDB database. This returns a promise, which allows us to handle the success and failure cases of the connection attempt.

   ```javascript
   mongoose
     .connect(uri, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
     })
     .then(() => {
       app.listen(5000, () => console.log("Server started on port 5000"));
     })
     .catch((err) => console.log(err));
   ```

   - **Options**:

     - `useNewUrlParser: true`: Uses the new URL string parser instead of the deprecated one.
     - `useUnifiedTopology: true`: Uses the new unified topology engine for MongoDB driver.

   - **Promise Handling**:
     - `.then()`: If the connection is successful, start the Express server on port 5000 and log a success message.
     - `.catch()`: If the connection fails, log the error.

### Complete Example

Here's the complete code snippet:

```javascript
const mongoose = require("mongoose");
const express = require("express");

const app = express();

const uri = `${process.env.MONGO_SCHEME}://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}/places?retryWrites=true&w=majority`;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(5000, () => console.log("Server started on port 5000"));
  })
  .catch((err) => console.log(err));
```

### What Does It Do?

1. **Imports Mongoose**:

   - Loads the Mongoose library to manage MongoDB interactions.

2. **Constructs the Connection URI**:

   - Uses environment variables to securely construct the URI for connecting to MongoDB.

3. **Establishes Connection to MongoDB**:

   - `mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })`: Initiates a connection to the MongoDB database with the provided URI and options.

4. **Handles Connection Success**:

   - `then(() => { app.listen(5000, () => console.log("Server started on port 5000")); })`: If the connection is successful, the Express server starts listening on port 5000, and a message is logged.

5. **Handles Connection Failure**:
   - `catch((err) => console.log(err))`: If the connection fails, the error is logged to the console.

### Summary

This setup ensures a secure and efficient connection to the MongoDB database using Mongoose. It also starts an Express server upon a successful connection, making your application ready to handle requests. By using environment variables for sensitive information, you enhance the security and flexibility of your application configuration.

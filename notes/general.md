# app.js

**Import Modules**:

- Imports `express` for creating the server.
- Imports `body-parser` to parse incoming JSON request bodies.

**Create Express App**:

- Creates an instance of an Express app.

**Import Routes**:

- Imports `placesRoutes` from the `./routes/places-routes` module.

**Middleware**:

- Uses `body-parser.json()` to parse incoming request bodies as JSON.
- Mounts `placesRoutes` at `/api/places`, directing any requests to this path to the `placesRoutes` module.

**Error Handling**:

- Defines a middleware function to handle errors.
- Checks if headers have already been sent.
- If not, sends a JSON response with an error status code and message.

**Start Server**:

- Listens on port 5000.
- Logs a message indicating the server is running.

```js
const express = require("express");
```

The statement const express = require("express"); is used to

- import the Express module in a Node.js application.

By requiring the Express module and assigning it to the variable express, developers can create an

- instance of an Express application and
- utilize its functionalities to set up servers and manage various web application tasks efficiently.

```js
const bodyParser = require("body-parser");
```

imports the body-parser middleware in a Node.js application.

- body-parser is used to **parse incoming request** bodies in a middleware before your handlers, making the parsed data available under `req.body`.
- This is essential for handling JSON, text, URL-encoded, and raw data payloads in HTTP requests, facilitating the processing of data sent from clients to the server.

```js
app.use(bodyParser.json());
```

in an Express application configures the app to use the body-parser middleware to parse incoming request bodies as JSON.
This means that any JSON data sent in the body of a request will be automatically parsed and made available under `req.body`, enabling the server to handle and process JSON payloads from clients easily.

### Error handling

```js
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res
    .status(err.code || 500)
    .json({ message: err.message || "An unknown error occurred" });
});
```

The code snippet `app.use((err, req, res, next) => { ... });` defines an error-handling middleware function in an Express application. Here's a breakdown of how it works:

1. **Error-Handling Middleware**:

   - This middleware is specifically designed to handle errors. In Express, error-handling middleware functions are defined with four arguments: `err`, `req`, `res`, and `next`.

2. **Check if Headers Are Sent**:

   - `if (res.headersSent) { return next(err); }`
   - This line checks if the response headers have already been sent to the client. If they have, the `next(err)` function is called to pass the error to the next error-handling middleware, if any. This prevents further modifications to the response after the headers are sent.

3. **Set Status Code and Send JSON Response**:
   - `res.status(err.code || 500).json({ message: err.message || "An unknown error occurred" });`
   - If the headers haven't been sent, the middleware sets the HTTP status code to the error code specified by `err.code` or defaults to `500` (Internal Server Error).
   - It then sends a JSON response containing the error message (`err.message`) or a default message ("An unknown error occurred").

### Purpose

The purpose of this error-handling middleware is to catch any errors that occur during request processing and send a standardized JSON response to the client with an appropriate HTTP status code and error message. This ensures that errors are handled gracefully and consistently across the application, providing useful feedback to the client and maintaining the integrity of the server's response handling.

### if (res.headersSent) { return next(err); }

The part `if (res.headersSent) { return next(err); }` in the error-handling middleware serves a specific purpose related to the HTTP response lifecycle. Let's break it down:

### Explanation

1. **`res.headersSent`**:

   - This is a property of the `res` (response) object in Express. It returns a boolean value indicating whether the response headers have already been sent to the client.
   - Once the headers are sent, the response is considered to be "in progress" or "finished," and additional changes to the headers or status code are not allowed.

2. **Why Check `res.headersSent`**:

   - In an Express application, it's possible for an error to occur after the response headers have already been sent to the client. For example, this can happen if an error occurs during the process of sending the response body.
   - If the headers are already sent, attempting to modify the response (like setting a status code or sending a different response body) will result in an error because the HTTP response is already partially sent.

3. **Using `next(err)`**:
   - When the condition `if (res.headersSent)` is true, it means that the response headers are already sent to the client.
   - In this case, the middleware calls `next(err)` to pass the error to the next error-handling middleware function, if any. This allows the application to continue the error-handling process without attempting to modify the already-sent response.

### Practical Example

Consider an Express route handler that sends a response and then encounters an error:

```javascript
app.get("/example", (req, res, next) => {
  res.send("This is a response");
  // An error occurs after sending the response
  next(new Error("Something went wrong!"));
});
```

### Error-Handling Middleware

In the error-handling middleware:

```javascript
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // Pass the error to the next middleware
  }
  res
    .status(err.code || 500)
    .json({ message: err.message || "An unknown error occurred" });
});
```

- When the error occurs after `res.send()`, the headers are already sent.
- `res.headersSent` will be `true`.
- The condition `if (res.headersSent)` will be true, and `next(err)` will be called to pass the error to any additional error-handling middleware, without attempting to modify the already-sent response.

### Summary

The check `if (res.headersSent) { return next(err); }` ensures that the error-handling middleware doesn't try to modify the response if it has already started or finished being sent to the client. Instead, it passes the error to the next error-handling middleware to handle it appropriately. This prevents potential errors and ensures that the response process is handled correctly.

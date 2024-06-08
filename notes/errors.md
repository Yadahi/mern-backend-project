- [Error handling](#error-handling)
- [Purpose](#purpose)
- [if (res.headersSent) { return next(err); }](#if-resheaderssent--return-nexterr-)
- [Explanation](#explanation)
- [Practical Example](#practical-example)
- [Error-Handling Middleware](#error-handling-middleware)
- [Summary](#summary)
  - [Class Declaration](#class-declaration)
  - [Constructor](#constructor)
- [Purpose](#purpose-1)
- [Example Usage](#example-usage)
  - [Throwing a Custom Error](#throwing-a-custom-error)
  - [Handling the Custom Error](#handling-the-custom-error)
- [Summary](#summary-1)

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

Certainly! The `HttpError` class in the provided code snippet is a custom error class that extends the built-in JavaScript `Error` class. This custom error class allows you to create error objects with both a message and an associated HTTP status code. Here’s a detailed explanation:

#### Class Declaration

```javascript
class HttpError extends Error {
```

- `class HttpError extends Error`:
  - This line defines a new class `HttpError` that extends the built-in `Error` class. By extending the `Error` class, `HttpError` inherits its properties and methods, making it a specialized type of error with additional features.

#### Constructor

```javascript
constructor(message, errorCode) {
  super(message);
  this.code = errorCode;
}
```

- The `constructor` is a special method in a class that is called when a new instance of the class is created. It initializes the instance.

1. **Parameters**:

   - `constructor(message, errorCode)`: The constructor takes two parameters:
     - `message`: A string representing the error message.
     - `errorCode`: An integer representing the HTTP status code associated with the error.

2. **Calling `super`**:

   - `super(message);`: The `super` function calls the constructor of the parent class (`Error`). This sets the `message` property of the `Error` object to the provided message. Essentially, it initializes the `Error` part of the `HttpError` object with the given message.

3. **Setting the Custom Property**:
   - `this.code = errorCode;`: This line sets a custom property `code` on the `HttpError` instance. This property holds the HTTP status code, allowing you to easily access and use it when handling the error.

### Purpose

The purpose of creating a custom error class like `HttpError` is to enhance the standard `Error` object with additional functionality specific to your application's needs. In this case, adding an HTTP status code to the error object allows you to handle errors more effectively in a web application context.

### Example Usage

Here’s an example of how you might use the `HttpError` class in an Express application:

#### Throwing a Custom Error

```javascript
app.get("/example", (req, res, next) => {
  try {
    // Some code that might cause an error
    if (someCondition) {
      throw new HttpError("Resource not found", 404);
    }
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
});
```

#### Handling the Custom Error

```javascript
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res
    .status(err.code || 500)
    .json({ message: err.message || "An unknown error occurred" });
});
```

### Summary

- **Custom Error Class**: `HttpError` extends the `Error` class to include an HTTP status code.
- **Constructor**: Takes an error message and an HTTP status code, initializing the `Error` with the message and adding a `code` property for the status code.
- **Purpose**: Provides a structured way to create and handle errors with associated HTTP status codes, enhancing error handling in web applications.

This custom error class simplifies the process of throwing and catching errors with HTTP status codes, making your error handling code cleaner and more consistent.

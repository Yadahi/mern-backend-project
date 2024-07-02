Certainly! Here’s a concise explanation of the process of creating, sending, and using JWT for authentication:

### 1. User Login and JWT Creation

**Backend: `user-controller.js`**

- The user submits their email and password to the backend.
- The backend verifies the user's credentials:
  - It checks if the user exists in the database.
  - It validates the password using bcrypt.
- If the credentials are valid, a JWT token is created using `jwt.sign` with the user's ID and email.
- The JWT token is sent back to the user in the response.

```javascript
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (
    !existingUser ||
    !(await bcrypt.compare(password, existingUser.password))
  ) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 401)
    );
  }

  const token = jwt.sign(
    { userId: existingUser.id, email: existingUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ userId: existingUser.id, email: existingUser.email, token });
};
```

### 2. Sending JWT from Frontend

**Frontend: `Auth.js`**

- The user submits the login form.
- The frontend sends a POST request with the user's email and password to the backend.
- On successful login, the backend responds with a JWT token.
- The frontend stores the token (e.g., in context or local storage) for future authenticated requests.

```javascript
const loginSubmitHandler = async (event) => {
  event.preventDefault();
  const responseData = await sendRequest(
    "http://localhost:5000/api/users/login",
    "POST",
    JSON.stringify({
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
    }),
    { "Content-Type": "application/json" }
  );

  auth.login(responseData.userId, responseData.token);
};
```

### 3. Using JWT for Authenticated Requests

**Frontend: Submitting a Form with JWT**

- For authenticated requests (e.g., creating a new place), the JWT token is included in the request headers.

```javascript
const placeSubmitHandler = async (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append("title", formState.inputs.title.value);
  formData.append("description", formState.inputs.description.value);
  formData.append("address", formState.inputs.address.value);
  formData.append("image", formState.inputs.image.value);

  await sendRequest("http://localhost:5000/api/places", "POST", formData, {
    Authorization: `Bearer ${auth.token}`,
  });
};
```

### 4. Verifying JWT on Backend

**Backend: `check-auth.js`**

- Middleware checks incoming requests for a JWT token in the `Authorization` header.
- It verifies the token using `jwt.verify`.
- If valid, it attaches the user data to the request object and allows the request to proceed.
- If invalid, it returns an authentication error.

```javascript
module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication token not found");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return next(new HttpError("Authentication failed", 401));
  }
};
```

### Summary of the JWT Authentication Process

1. **User Login**:

   - User submits login details.
   - Backend verifies credentials and creates a JWT token.
   - Token is sent back to the user.

2. **Frontend Handling**:

   - Receives the JWT token and stores it.
   - Uses the token in headers for authenticated requests.

3. **Authenticated Requests**:
   - Token is included in request headers.
   - Backend middleware verifies the token.
   - If valid, the request proceeds; if invalid, an error is returned.

This process ensures secure authentication and authorization using JWT tokens, allowing only authenticated users to access protected routes and resources.

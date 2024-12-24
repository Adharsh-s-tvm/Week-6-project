const express = require('express');
const app = express();
const session = require('express-session');
const nocache = require("nocache");
const path = require("path");

// Set up view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to disable caching
app.use(nocache());

// Session configuration
app.use(session({
    secret: "password",  // Secret key for session
    resave: false,       // Don't save session if it's not modified
    saveUninitialized: true  // Save empty sessions
}));

// Middleware to parse URL-encoded and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route handlers
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
app.use("/user", userRoute);  // User-related routes
app.use("/admin", adminRoute);  // Admin-related routes

// Start server on port 8080
app.listen(8080, () => {
    console.log('Server running at port 8080');
});

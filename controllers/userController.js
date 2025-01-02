const collection = require("../models/mongodb"); // MongoDB collection
const userAuthenticated = require("../middleware/userauthmildware"); // User authentication middleware

// Signup Page
exports.signup = (req, res) => {
  if (req.session.user) {
    res.redirect("/user/home"); // Redirect if already logged in
  } else {
    res.render("user/signup", { message: null }); // Render signup page
  }
};

// Signup POST
exports.signuppost = async (req, res) => {
  console.log(req.body, "signup details"); // Log signup details

  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const existingUser = await collection.findOne({ email: userData.email }); // Check if user already exists
  if (existingUser) {
    res.render("user/signup", { message: "email already exists" }); // Error message for existing user
  } else {
    await collection.insertMany(userData); // Create new user
    res.redirect("/user/login"); // Redirect to login
  }
};

// Login Page
exports.login = (req, res) =>{
  if (req.session.user) {
    res.redirect("/user/home"); // Redirect if already logged in
  } else {
    let alert = null;
    if(req.query){
      alert = req.query.error      
    }
    res.render("user/login", { message: alert }); // Render login page
  }
};

// Login POST
exports.loginpost = async (req, res) => {
  try {
    const foundUser = await collection.findOne({ email: req.body.email }); // Find user by email

    if (foundUser.password === req.body.password) {
      console.log("Auth done");
      req.session.user = req.body.email; // Set session for logged-in user
      req.session.name = req.body.name;
      res.redirect("/user/home"); // Redirect to home
    } else {
      res.redirect("/user/login?error=Invalid username or password"); // Error message for incorrect password
    }
  } catch (error) {
    res.redirct("user/login", { message: "User not found" }); // Error message for unregistered email
  }
};

// Home Page
exports.home = [
  userAuthenticated, // User authentication middleware
  async (req, res) => {
    try {
      const user = await collection.findOne({ email: req.session.user }); // Find user by session email
      if (user) {
        res.render("user/home", { name: user.name, mail_id: req.session.user }); // Render home page
      } else {
        req.session.user = false;
        res.redirect("/user/login"); // Redirect to login if no user found
      }
    } catch (error) {
      console.error("Error happened", error.message); // Log error
    }
  },
];

// Logout
exports.logout = (req, res) => {
  req.session.user = false; // Destroy session
  res.redirect("/user/login"); // Redirect to login
};

const collection = require("../models/mongodb"); // MongoDB collection
const userAuthenticated = require("../middleware/adminauthmildware"); // Admin auth middleware

// Login Page
exports.login = (req, res) => {
  if (req.session.admin) {
    res.redirect("/admin/home"); // Redirect if already logged in
  } else {
    let alert = null
    if(req.query){
      alert = req.query.error;
    }  
    res.render("admin/login", { message: alert }); // Render login page
  }
};

// Login POST
exports.loginpost = (req, res) => {
  const adminData = {
    name: "admin",
    email: "admin@gmail.com",
    password: "1234", // Hardcoded admin credentials
  };

  if (adminData.email === req.body.email && adminData.password === req.body.password) {
    req.session.admin = req.body.email; // Set session
    res.redirect("/admin/home"); // Redirect to home
  } else {
    res.redirect("/admin/login?error=Invalid username or password"); // Error message
  }
};

// Home Page
exports.home = [
  userAuthenticated, // Admin authentication
  async (req, res) => {
    const searchQuery = req.query.search ? req.query.search.trim() : ""; // Search query
    const users = await collection.find({ name: { $regex: new RegExp(searchQuery, "i") } }); // Get users by search query
    res.render("admin/home", { users, searchQuery }); // Render home page with users
  },
];

// Logout
exports.logout = (req, res) => {
  req.session.admin = false; // Destroy session
  res.redirect("/admin/login"); // Redirect to login
};

// Delete User
exports.userdelete = async (req, res) => {
  try {
    const userId = req.params.id;  
    await collection.deleteOne({ _id: userId }); // Delete user
    res.redirect("/admin/home"); // Redirect to home
  } catch (error) {
    console.error("Error deleting user:", error); // Handle error
  }
};

// Edit User
exports.useredit = async (req, res) => {
  try {
    const userId = req.params.id; 
    const { name, email } = req.body;
    await collection.updateOne({ _id: userId }, { $set: { name, email } }); // Update user details
    res.redirect("/admin/home"); // Redirect to home
  } catch (error) {
    console.error("Error updating user:", error); // Handle error
  }
};

// Get Edit Page
exports.getEditPage = [
  userAuthenticated, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await collection.findOne({ _id: userId }); // Fetch user details
    if (!user) {
      return res.status(404).send("User not found"); // Handle user not found
    }
    res.render("admin/edit", { user }); // Render edit page with user data
  } catch (error) {
    console.error("Error fetching user:", error); // Handle error
  }
}
]

// Create User Page
exports.createuser = [
  userAuthenticated, (req, res) => {
    if (req.session.user) {
      res.redirect("/admin/createuser"); // Redirect if already logged in
    } else {
      res.render("admin/createuser", { message: null }); // Render create user page
    }
  }
];

// Create User POST
exports.createuserpost = async (req, res) => {
  console.log(req.body, "signup details"); // Log user input

  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const existingUser = await collection.findOne({ email: userData.email }); // Check if user exists
  if (existingUser) {
    res.render("admin/createuser", { message: "email already exists" }); // Handle existing email
  } else {
    await collection.insertMany(userData); // Insert new user
    res.redirect("/admin/home"); // Redirect to home
  }
};

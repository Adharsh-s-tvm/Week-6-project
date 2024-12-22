const collection = require("../models/mongodb");
const userAuthenticated = require("../middleware/adminauthmildware");


//Login page
exports.login = (req, res) => {
  if (req.session.admin) {
    res.redirect("/admin/home");
  } else {
    res.render("admin/login", { message: null });
  }
};

exports.loginpost = (req, res) => {
  const adminData = {
    name: "admin",
    email: "admin@gmail.com",
    password: "1234",
  };

  if (
    adminData.email === req.body.email &&
    adminData.password === req.body.password
  ) {
    console.log("admin login success");
    req.session.admin = req.body.email;
    res.redirect("/admin/home");
  } else {
    res.render("admin/login", { message: "wrong Admin email id or password" });
  }
};

///////////////////Home page/////////////////////
exports.home = [
  userAuthenticated,
  async (req, res) => {
    const searchQuery = req.query.search ? req.query.search.trim() : "";

    const users = await collection.find({
      name: { $regex: new RegExp(searchQuery, "i") },
    });

    // console.log("Search Query:", searchQuery);
    // console.log("Users Found:", users);

    res.render("admin/home", { users, searchQuery });
  },
];

exports.logout = (req, res) => {
  req.session.admin = false;
  res.redirect("/admin/login");
};


///////////////////Delete User/////////////////////
exports.userdelete = async (req, res) => {
  try {
    const userId = req.params.id;  
    await collection.deleteOne({ _id: userId });  
    res.redirect("/admin/home");  
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};



///////////////////Edit User/////////////////////
exports.useredit = async (req, res) => {
  try {
    const userId = req.params.id; 
    const { name, email } = req.body;

    await collection.updateOne(
      { _id: userId },
      { $set: { name: name, email: email } }
    );

    res.redirect("/admin/home");
  } catch (error) {
    console.error("Error updating user:", error);
  }
};


exports.getEditPage =[
  userAuthenticated, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await collection.findOne({ _id: userId });

    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("admin/edit", { user });
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}
]


///////////////////Create User/////////////////////
exports.createuser =[
  userAuthenticated, (req, res) => {
  if (req.session.user) {
    res.redirect("/admin/createuser");
  } else {
    res.render("admin/createuser", { message: null });
  }
}
]

exports.createuserpost = async (req, res) => {
  console.log(req.body, "signup details");

  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const existingUser = await collection.findOne({ email: userData.email });
  if (existingUser) {
    res.render("admin/createuser", { message: "email already exists" });
  } else {
    await collection.insertMany(userData);
    res.redirect("/admin/home");
  }
};



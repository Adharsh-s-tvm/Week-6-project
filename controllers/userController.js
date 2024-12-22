const collection = require("../models/mongodb");
const userAuthenticated = require("../middleware/userauthmildware");


///////////////////Signup page/////////////////////
exports.signup = (req, res) => {
  if (req.session.user) {
    res.redirect("/user/home");
  } else {
    res.render("user/signup", { message: null });
  }
};

exports.signuppost = async (req, res) => {
  console.log(req.body, "signup details");

  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const existingUser = await collection.findOne({ email: userData.email });
  if (existingUser) {
    res.render("user/signup", { message: "email already exists" });
  } else {
    await collection.insertMany(userData);
    res.redirect("/user/login");
  }
};


///////////////////Login page/////////////////////
exports.login = (req, res) => {
  if (req.session.user) {
    res.redirect("/user/home");
  } else {
    res.render("user/login", { message: null });
  }
};

exports.loginpost = async (req, res) => {
  try {
    const foundUser = await collection.findOne({ email: req.body.email });

    if (foundUser.password === req.body.password) {
      console.log("Auth done");
      req.session.user = req.body.email;
      req.session.name = req.body.name;
      res.redirect("/user/home");
    } else {
      res.render("user/login", { message: "wrong password" });
    }
  } catch (error) {
    res.render("user/login", { message: "email id not registred" });
  }
};


///////////////////Home page/////////////////////
exports.home = [
  userAuthenticated,
  async (req, res) => {
    try {
      const user = await collection.findOne({ email: req.session.user });
      if (user) {
        res.render("user/home", {
          name: user.name,
          mail_id: req.session.user,
        });
      } else {
        req.session.user = false;
        res.redirect("/user/login");
      }
    } catch (error) {
      onsole.error("Error happened", error.message);
    }
  },
];

exports.logout = (req, res) => {
  req.session.user = false;
  res.redirect("/user/login");
};

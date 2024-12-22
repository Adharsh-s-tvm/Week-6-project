const express = require('express')
const app = express()
const session = require('express-session')
const nocache = require("nocache");
app.set("view engine", "ejs");
const path = require("path");
app.set("views", path.join(__dirname, "views"));

app.use(nocache());

app.use(session({
    secret: "password",
    resave: false,
    saveUninitialized: true,
    })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const userRoute = require("./routes/user");
app.use("/user", userRoute);

const adminRoute = require("./routes/admin");
app.use("/admin", adminRoute);


app.listen(8080,()=>{
    console.log('running at 8080')
})
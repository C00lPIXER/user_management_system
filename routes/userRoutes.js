// Import modules
const express = require("express");
const path = require("path");
const session = require("express-session");
const userController = require("../Controllers/userController");
const userAuthentication = require("../middleware/auth")
const nocache = require("nocache")


// Initialize Express app
const app = express();
const routes = express.Router();

app.use(nocache())

routes.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true
}))

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", "./views");


// Middleware
routes.use(express.urlencoded({ extended: true }));

// User Routes
routes.get("/", userAuthentication.isLogout, userController.loadLogin);
routes.get("/login", userAuthentication.isLogout, userController.loadLogin);
routes.get("/signup", userAuthentication.isLogout, userController.loadSignUp);
routes.post("/signup", userController.insertUser);
routes.post("/login", userController.userAuthentication);
routes.get("/home", userAuthentication.isLogin, userController.loadHome);
routes.get("/logout",userController.loadLogout)

// Use routes
app.use("/", routes);

// Export the app module
module.exports = app;

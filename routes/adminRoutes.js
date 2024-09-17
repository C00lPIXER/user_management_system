// Import modules
const express = require("express");
const path = require("path");
const session = require("express-session");
const adminController = require("../Controllers/adminController");
const adminAuthentication = require("../middleware/adminAuth");
const nocache = require("nocache");

// Initialize Express app
const app = express();
const admin_routes = express.Router();

app.use(nocache())

admin_routes.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true
}))

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", "./views");
app.set("views", "./views/admin");

// Middleware
admin_routes.use(express.urlencoded({ extended: true }));

//Admin routes
admin_routes.get("/admin", adminAuthentication.isadminLogout, adminController.loadAdmin);
admin_routes.post("/admin", adminController.adminAuthentication);
admin_routes.get("/dashboard", adminAuthentication.isadminLogin, adminController.loaddashboard);
admin_routes.get("/dashboard/add-user", adminController.loadaddUser)
admin_routes.post("/dashboard/userAdded", adminController.adminInsert)
admin_routes.get("/dashboard/userExis", adminController.loadaddUser)
admin_routes.get('/dashboard/delete-user/:id', adminAuthentication.isAdmin, adminController.deleteUser)
admin_routes.get('/dashboard/edit-user/:id',  adminAuthentication.isAdmin, adminController.loadEditUser);
admin_routes.post('/dashboard/edited', adminAuthentication.isAdmin, adminController.editUser);
admin_routes.get('/dashboard/search', adminController.searchUsers);
admin_routes.get("/adminlogout", adminController.loadadminLogout)


// Use routes
app.use("/", admin_routes);

// Export the app module
module.exports = app;

const User = require("../modals/user_data");
const bcrypt = require("bcrypt");

const securePasswd = async (passwd) => {
  try {
    const passdHash = await bcrypt.hash(passwd, 10);
    return passdHash;
  } catch (error) {
    console.log(error.message);
  }
};

const loadAdmin = async (req, res) => {
  try {
    if (req.session.invalid) {
        req.session.invalid = false;
      res.render("adminlogin", { message: "Invalid email or password" });
    } else {
      res.render("adminlogin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const adminAuthentication = async (req, res) => {
  try {
    const email = req.body.email;
    const passwd = req.body.passwd;

    const adminData = await User.findOne({ email: email });

    if (adminData && adminData.is_admin) {
      const passwdMatch = await bcrypt.compare(passwd, adminData.passwd);
      if (passwdMatch) {
        req.session.admin = adminData._id;
        res.redirect("/dashboard");
      } else {
        req.session.invalid = true;
        res.redirect("/admin");
      }
    } else {
      req.session.invalid = true;
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loaddashboard = async (req, res) => {
  try {
    const users = await User.find();
    if (req.session.admin) {
      res.render("dashboard", { users });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadaddUser = async (req, res) => {
  try {
    if (req.session.admin) {
      if (req.session.isExist) {
        req.session.isExist = false;
        res.render("addUser", { message: "Email already exists" });
      } else {
        res.render("addUser");
      }
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

const adminInsert = async (req, res) => {
  try {
    const isExist = await User.findOne({ email: req.body.email });
    console.log("isExist");

    if (isExist) {
      req.session.isExist = true;
      res.redirect("userExis");
    } else {
      console.log("new user added");
      const sPasswd = await securePasswd(req.body.passwd);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        passwd: sPasswd,
        signUpDate: String(Date()),
        is_admin: false,
      });

      const userData = await user.save();

      if (userData) {
        req.session.usercreatedbyadmin = true;
        res.redirect("/dashboard");
      } else {
        res.redirect("/addUser");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    console.log("user deleted");

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

const loadEditUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user) {
      res.render("editUser", { user });
    } else {
      res.redirect("/dashboard");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editUser = async (req, res) => {
  try {
    const userId = req.body.id;
    const email = req.body.email;

    const existingUser = await User.findOne({ email: email, _id: { $ne: userId } });
    
    if (existingUser) {
      const user = await User.findById(userId);
      res.render("editUser", { user, message: "Email already exists"});
    } else {
      await User.findByIdAndUpdate(userId, {
        name: req.body.name,
        email: req.body.email,
      });
      res.redirect("/dashboard");
    }
  } catch (error) {
    console.error(error.message);
  }
};

const searchUsers = async (req, res) => {
  try {
    const query = req.query.feed;
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    if (req.session.admin) {
      res.render("dashboard", { users });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadadminLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.lof(error.message);
  }
};

module.exports = {
  loadAdmin,
  adminAuthentication,
  loaddashboard,
  loadaddUser,
  adminInsert,
  deleteUser,
  loadEditUser,
  editUser,
  searchUsers,
  loadadminLogout,
};

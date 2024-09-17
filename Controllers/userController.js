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

const loadSignUp = async (req, res) => {
  try {
    if(req.session.isEmpty){
      req.session.isEmpty = false;
      res.render("signup", { message: "Name Can't be empty" });
    }else if(req.session.isExist) {
      req.session.isExist = false;
      res.render("signup", { message: "Email already existed" });
    } else {
      res.render("signup");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const insertUser = async (req, res) => {
  try {
    if(req.body.name.trim() !== ""){
    const isExist = await User.findOne({ email: req.body.email });
    console.log(isExist);

    if (isExist) {
      req.session.isExist = true;
      res.redirect("/signup");
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
        req.session.usercreated = true;
        res.redirect("/login");
      } else {
        res.render("/singup");
      }
    }
  }else{
    req.session.isEmpty = true
    res.redirect("/signup")
  }
  } catch (error) {
    console.log(error.message);
  }
};

const loadLogin = async (req, res) => {
  try {
    if (req.session.invalid) {
      req.session.invalid = false;
      res.render("login", { message: "Invalid email or password" });
    } else if (req.session.usercreated) {
      req.session.usercreated = false;
      res.render("login", { successmsg: "Successfully SignUp" });
    } else {
      res.render("login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const userAuthentication = async (req, res) => {
  try {
    const email = req.body.email;
    const passwd = req.body.passwd;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwdMatch = await bcrypt.compare(passwd, userData.passwd);
      if (passwdMatch) {
        req.session.user = userData._id;
        res.redirect("/home");
      } else {
        req.session.invalid = true;
        res.redirect("/login");
      }
    } else {
      req.session.invalid = true;
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadHome = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.session.user });
    if (req.session.user) {
      res.render("home", { user: user });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/login");
  } catch (error) {
    console.lof(error.message);
  }
};

module.exports = {
  loadSignUp,
  loadLogin,
  insertUser,
  userAuthentication,
  loadHome,
  loadLogout,
};

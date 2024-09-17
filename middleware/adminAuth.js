const isadminLogin = async (req, res, next) => {
    try {
      if (req.session.admin) {
          next();
      } else {
        res.redirect("/admin");
      }
    } catch (error) {
      console.log("error.message");
    }
  };
  
  const isadminLogout = async (req, res, next) => {
    try {
      if (req.session.admin) {
        res.redirect("/dashboard");
      }else{
          next();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const isAdmin = (req, res, next) => {
    if (req.session.admin) {
        next();
    } else {
        res.redirect('/admin');
    }
};
  
  module.exports = {
      isadminLogin,
      isadminLogout,
      isAdmin
  }
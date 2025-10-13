const jwt = require("jsonwebtoken");

function checkAccountType(req, res, next) {
  const token = req.cookies?.jwt;
  if (!token) {
    req.flash(
      "message",
      "You must be logged in to access inventory management."
    );
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Expose values to views/controllers
    res.locals.loggedIn = true;
    res.locals.account_id = decoded.account_id;
    res.locals.account_firstname = decoded.account_firstname;
    res.locals.account_type = decoded.account_type;

    if (
      decoded.account_type === "Employee" ||
      decoded.account_type === "Admin"
    ) {
      return next();
    }

    req.flash(
      "message",
      "Access denied. Inventory tools are restricted to employees and admins."
    );
    return res.redirect("/account/login");
  } catch (err) {
    console.error("JWT verification failed:", err);
    req.flash("message", "Session expired. Please log in again.");
    return res.redirect("/account/login");
  }
}





function requireAuth(req, res, next) {
  const token = req.cookies?.jwt;
  if (!token) {
    res.locals.loggedIn = false;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    res.locals.loggedIn = true;
    res.locals.accountData = {
      account_id: decoded.account_id,
      account_firstname: decoded.account_firstname, // must match what you sign
      account_type: decoded.account_type,
    };
  } catch {
    res.locals.loggedIn = false;
  }
  return next();
}





function checkLogin(req, res, next) {
  const token = req.cookies?.jwt;
  if (!token) {
    res.locals.loggedIn = false;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.locals.loggedIn = true;
    res.locals.account_id = decoded.account_id;
    res.locals.account_firstname = decoded.account_firstname;
    res.locals.account_type = decoded.account_type;
  } catch (err) {
    res.locals.loggedIn = false;
  }
  next();
}






module.exports = {
  checkAccountType,
  requireAuth,
  checkLogin
};


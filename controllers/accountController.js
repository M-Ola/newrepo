const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    message: req.flash("message") || null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    message: req.flash("message") || null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "message",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("message", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function accountLogin(req, res) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  // 1. Look up account by email
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
try {
    const validPassword = await bcrypt.compare(
      account_password,
      accountData.account_password
    );
    if (!validPassword) {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
delete accountData.account_password;
    const accessToken = jwt.sign(
      {
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_type: accountData.account_type,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } // 1 hour
    );
res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600000, // 1 hour in ms
    });
 req.flash("message", "Login successful!");
    return res.redirect("/account/");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).render("errors/500");
  }
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildAccountManagement(req, res) {
  try {
    const accountData = res.locals.accountData;
    if (!accountData) {
      req.flash("message", "Please log in.");
      return res.redirect("/account/login");
    }

    const account = await accountModel.getAccountById(accountData.account_id);
    const nav = await utilities.getNav();

    res.render("account/account-management", {
      title: "Account Management",
      nav,
      account,
      account_id: account.account_id,
      account_firstname: account.account_firstname,
      account_type: account.account_type,
      message: req.flash("message"),
      errors: null,
    });
  } catch (err) {
    console.error("Error building account management view:", err);
    return res.status(500).render("errors/500");
  }
}

/* ****************************************
 *  Deliver update account view
 * *************************************** */
async function buildUpdateAccount(req, res) {
  const account_id = parseInt(req.params.account_id, 10);
  const account = await accountModel.getAccountById(account_id);
  const nav = await utilities.getNav();

  res.render("account/update-account", {
    title: "Update Account Information",
    nav,
    account,
    account_id,
    message: req.flash("message"),
    errors: null,
  });
}

/* ****************************************
 *  Deliver update account info view
 * *************************************** */
async function updateAccountInfo(req, res) {
  const account_id = parseInt(req.params.account_id, 10);
  const { account_firstname, account_lastname, account_email } = req.body;

  const result = await accountModel.updateAccountInfo(account_id, {
    account_firstname,
    account_lastname,
    account_email,
  });

  const message = result
    ? "Account updated successfully."
    : "Update failed. Please try again.";
  req.flash("message", message);

  const account = await accountModel.getAccountById(account_id);
  const nav = await utilities.getNav();

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    account,
    account_id,
    account_firstname: account.account_firstname,
    account_type: account.account_type,
    message,
    errors: [],
  });
}


/* ****************************************
 *  Deliver update password info view
 * *************************************** */
async function updatePassword(req, res) {
  try {
    const clientId = parseInt(req.params.clientId, 10);
    const { password } = req.body;

    // Hash and update
    const hashed = await bcrypt.hash(password, 12);
    const result = await accountModel.updatePassword(clientId, hashed);
    const message = result
      ? "Password changed successfully."
      : "Password update failed.";

    req.flash("message", message);

    // Fetch fresh data for management view
    const account = await accountModel.getAccountById(clientId);
    const nav = await utilities.getNav();
    return res.render("account/account-management", {
      title: "Account Management",
      nav,
      account,
      clientId,
      clientName: account.account_firstname,
      accountType: account.account_type,
      message,
      errors: [],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/500");
  }
}

/* Process logout */
async function accountLogout(req, res) {
  // Clear the JWT cookie
  res.clearCookie("jwt");

req.flash("message", "You have been logged out successfully.");

  // Redirect to home page
  return res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  accountLogout,
  buildUpdateAccount,
  updateAccountInfo,
  updatePassword

};

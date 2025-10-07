const utilities = require(".");
const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const validate = {};
const { getAccountByEmail } = require("../models/account-model");
const accountController = require("../controllers/accountController");

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data registration rules
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors: errors.array(),
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};


/* ******************************
 * Check login data rules
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  //let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors: errors.array(),
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};


/* ******************************
 * Check update account rules
 * ***************************** */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters."),
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters."),
    body("account_email")
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (email, { req }) => {
        const existing = await accountModel.getAccountByEmail(email);
        if (existing && existing.account_id != req.params.account_id) {
          throw new Error("Email already in use.");
        }
      }),
  ];
};

/* ******************************
 * Check password rules
 * ***************************** */
validate.passwordRules = () => {
  return [
    body("account_password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters.")
      .matches(/[0-9]/)
      .withMessage("Password must contain a number.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter.")
      .matches(/[!@#$%^&*]/)
      .withMessage("Password must contain a special character."),
  ];
};


/* ******************************
 * Check updated data rules
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const account = await accountModel.getAccountById(req.params.account_id);
    const nav = await require("../utilities").getNav();
    return res.render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors: errors.array(),
      message: req.flash("message"),
      account,
      account_id: account.account_id,
    });
  }
  next();
};

/* ******************************
 * Check password data
 * ***************************** */
validate. checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const account = await accountModel.getAccountById(req.params.account_id);
    const nav = await require("../utilities").getNav();
    return res.render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors: errors.array(),
      message: req.flash("message"),
      account,
      account_id: account.account_id,
    });
  }
  next();
};



module.exports = validate;

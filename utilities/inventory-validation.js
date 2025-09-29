
const utilities = require(".");
//const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");
const validate = {};




validate.classificationRules = () => [
  body("classification_name")
    .trim()
    .isLength({ min: 1 })
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage(
      "Classification name must not contain spaces or special characters."
    ),
];

validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      message: req.flash("message"),
      classification_name: req.body.classification_name,
    });
    return;
  }
  next();
};



validate.inventoryRules = () => [
  body("inv_make")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Make must be at least 3 characters long."),

  body("inv_model")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Model must be at least 3 characters long."),

  body("inv_year")
    .trim()
    .matches(/^\d{4}$/)
    .withMessage("Year must be a 4-digit number."),

  body("inv_description")
    .trim()
    .notEmpty()
    .withMessage("Description is required."),

  body("inv_price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),

  body("inv_miles")
    .isInt({ min: 0 })
    .withMessage("Miles must be a positive whole number."),

  body("inv_color").trim().notEmpty().withMessage("Color is required."),

  body("classification_id")
    .isInt()
    .withMessage("Classification must be selected."),

  body("inv_image").trim().notEmpty().withMessage("Image path is required."),

  body("inv_thumbnail")
    .trim()
    .notEmpty()
    .withMessage("Thumbnail path is required."),
];

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(
      req.body.classification_id
    );
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: errors.array(),
      message: req.flash("message"),
      classificationList,
      ...req.body, // sticky values
    });
    return;
  }
  next();
};

module.exports = validate;


validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(
      req.body.classification_id
    );
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: errors.array(),
      message: req.flash("message"),
      classificationList,
      ...req.body, // sticky values
    });
    return;
  }
  next();
};


module.exports = validate;
// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const classificationValidate = require("../utilities/inventory-validation");
const inventoryValidate = require("../utilities/inventory-validation");
const { checkAccountType } = require("../utilities/json-web-token");
const { checkLogin } = require("../utilities/json-web-token");

const favoritesController = require("../controllers/favoritesController");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
  

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);


// Route to build inventory by inventory-id view
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildDetailView)
);

// // Route to build management view  (protected)
router.get(
  "/",
  checkAccountType,
  utilities.handleErrors(invController.buildManagement)
);

// Add classification (protected)
router.get(
  "/add-classification",
  checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

router.post(
  "/add-classification",
  checkAccountType,
  classificationValidate.classificationRules(),
  classificationValidate.checkClassificationData,
  utilities.handleErrors(invController.insertClassification)
);

// Add inventory (protected)
router.get(
  "/add-inventory",
  checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);
router.post(
  "/add-inventory",
  checkAccountType,
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.insertInventory)
);

// Edit inventory (protected)
router.get(
  "/edit/:inv_id",
  checkAccountType,
  utilities.handleErrors(invController.buildEditInventory)
);
router.post(
  "/update",
  checkAccountType,
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Delete inventory (protected)
router.get(
  "/delete/:inv_id",
  checkAccountType,
  utilities.handleErrors(invController.buildDeleteInventory)
);
router.post(
  "/delete",
  checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
);

// Route to build favorites with middleware
router.get("/favorites", checkLogin, favoritesController.buildFavoritesView);
router.get("/favorite/:inv_id", checkLogin, favoritesController.addFavorite);
router.get(
  "/unfavorite/:inv_id",
  checkLogin,
  favoritesController.removeFavorite
);

router.get(
  "/getInventory/:inv_id",
  utilities.handleErrors(invController.buildDetailView)
);




module.exports = router;

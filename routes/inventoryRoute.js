// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidate = require("../utilities/inventory-validation");
const inventoryValidate = require("../utilities/inventory-validation");
const {checkAccountType} = require("../utilities/json-web-token");

// Route to build inventory by classification view
router.get("/type/:classificationId",    utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by inventory-id view
router.get("/detail/:inv_id",   utilities.handleErrors(invController.buildDetailView))

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement));
// Add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post(
  "/add-classification",
  classificationValidate.classificationRules(),
  classificationValidate.checkClassificationData,
  utilities.handleErrors(invController.insertClassification)
);

// Add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

router.post(
  "/add-inventory",
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.insertInventory)
);


router.get("/getInventory/:classification_id",
  
utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build edit inventory view by inventory_id
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.buildEditInventory)
);




// Route to handle inventory update
router.post(
  "/update",
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);


router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.buildDeleteInventory)
);

// Delete confirmation view
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventory));

// Delete execution
router.post("/delete", utilities.handleErrors(invController.deleteInventory));

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// Public routes (no middleware)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetailView));

// Protected routes
router.get("/add-classification", checkAccountType, utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", checkAccountType, utilities.handleErrors(invController.insertClassification));

router.get("/add-inventory", checkAccountType, utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", checkAccountType, utilities.handleErrors(invController.insertInventory));

router.get("/edit/:inv_id", checkAccountType, utilities.handleErrors(invController.buildEditInventory));
router.post("/update", checkAccountType, utilities.handleErrors(invController.updateInventory));

router.get("/delete/:inv_id", checkAccountType, utilities.handleErrors(invController.buildDeleteInventory));
router.post("/delete", checkAccountType, utilities.handleErrors(invController.deleteInventory));





module.exports = router;
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidate = require("../utilities/inventory-validation");


const inventoryValidate = require("../utilities/inventory-validation");


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




module.exports = router;
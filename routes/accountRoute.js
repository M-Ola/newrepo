const express = require('express')
const router = new express.Router()
const utilities = require('../utilities')
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const accountValidate = require("../utilities/account-validation");
const { requireAuth,checkAccountType  } = require("../utilities/json-web-token");

//Route to build login view
router.get('/login', utilities.handleErrors(accountController.buildLogin))

//Route to build login view
router.get('/register', utilities.handleErrors(accountController.buildRegister))


router.post('/register', regValidate.registationRules(),
    regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))
  

 // Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

 
// Default account management view
router.get("/", requireAuth,  utilities.checkLogin, accountController.buildAccountManagement);

// Deliver update view
router.get("/update/:account_id", requireAuth, accountController.buildUpdateAccount);

// Process account info update
router.post(
  "/update/:account_id",
  requireAuth,
  accountValidate.updateAccountRules(),   // validation middleware
  accountValidate.checkUpdateData,        // error handling
  accountController.updateAccountInfo
);

// Process password change
router.post(
  "/update-password/:account_id",
  requireAuth,
  accountValidate.passwordRules(),        // validation middleware
  accountValidate.checkPasswordData,      // error handling
  accountController.updatePassword
);

router.get("/logout", accountController.accountLogout);

module.exports = router;
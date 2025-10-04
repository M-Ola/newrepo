const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")



const invCont = {}


/* ***************************
 *  Build inventory by classification view
 * ************************** */
/* invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
} */


invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const nav = await utilities.getNav();

  const className = data.length > 0 ? data[0].classification_name : "Vehicles";
  const grid =
    data.length > 0
      ? await utilities.buildClassificationGrid(data)
      : "<p>No vehicles found for this classification.</p>";

  res.render("./inventory/classification", {
    title: `${className} vehicles`,
    nav,
    grid,
  });
};






 /* ***************************
 *  Build detail view by id
 * ************************** */
invCont.buildDetailView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();
  const vehicleData = await invModel.getVehicleById(inv_id);
  const vehicleHTML = await utilities.buildVehicleDetail(vehicleData);
  const title = `${vehicleData.inv_make} ${vehicleData.inv_model}`;

  res.render("./inventory/detail", {
    title,
    nav,
    vehicleHTML
  });
};



  invCont.buildManagement= async function(req, res, next) {
  const nav = await utilities.getNav();
  let classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/management", {
    title: "Vehicle Management",
      nav,
    classificationSelect,
    message: req.flash("message") || null,
  });
}



invCont.buildAddClassification=   async function(req, res) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    message: req.flash("message") || null,
  });
} 

 invCont.insertClassification=   async function(req, res) {
  const { classification_name } = req.body;
  const nav = await utilities.getNav();
  const result = await invModel.addClassification(classification_name);

  if (result) {
    req.flash("message", "Classification added successfully.");
    const updatedNav = await utilities.getNav(); // refresh nav
    res.render("inventory/management", {
      title: "Inventory Management",
      nav: updatedNav,
      message: req.flash("message"),
    });
  } else {
    req.flash("message", "Failed to add classification.");
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: req.flash("message"),
      classification_name,
    });
  }
}



invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    message: req.flash("message") || null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    classification_id: "",
  });
};

 



 invCont.insertInventory=   async function(req, res) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(
    req.body.classification_id
  );

  const result = await invModel.addInventory(req.body);

  if (result) {
    req.flash("message", "Inventory item added successfully.");
    const updatedNav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav: updatedNav,
      message: req.flash("message"),
    });
  } else {
    req.flash("message", "Failed to add inventory item.");
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      message: req.flash("message"),
      errors: null,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      classification_id: req.body.classification_id,
    });
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build Edit Inventory View
 * ************************** */
invCont.buildEditInventory = async function (req, res) {
  const inv_id = parseInt(req.params.inv_id); // ✅ Step: collect inventory_id
  const nav = await utilities.getNav();
  const itemData = await invModel.getVehicleById(inv_id);
  
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
const name = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("./inventory/edit-inventory", {
    title: `Edit ${name}`,
    nav,
    classificationSelect,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    message: req.flash("message"),
    errors: null
  });
};


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res) {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body;

  const updateResult = await invModel.updateInventory({
    inv_id: parseInt(inv_id),
    inv_make,
    inv_model,
    inv_year: parseInt(inv_year),
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price: parseFloat(inv_price),
    inv_miles: parseInt(inv_miles),
    inv_color,
    classification_id: parseInt(classification_id)
  });

  if (updateResult) {
    req.flash("message", "Inventory item successfully updated.");
    res.redirect("/inv");
  } else {
    req.flash("message", "Update failed. Please try again.");
    res.redirect(`/inv/edit/${inv_id}`);
  }
};






module.exports =  invCont 
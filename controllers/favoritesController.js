const favoritesModel = require("../models/favorites-model");
const utilities = require("../utilities/");

// Add a favorite
exports.addFavorite = async function (req, res, next) {
  try {
    const account_id = res.locals.account_id;
    const inv_id = req.params.inv_id;

    await favoritesModel.addFavorite(account_id, inv_id);

    req.flash("message", "Vehicle added to favorites!");
    res.redirect("/inv/favorites");
  } catch (err) {
    next(err);
  }
};

// Remove a favorite
exports.removeFavorite = async function (req, res, next) {
  try {
    const account_id = res.locals.account_id;
    const inv_id = req.params.inv_id;

    await favoritesModel.removeFavorite(account_id, inv_id);

    req.flash("message", "Vehicle removed from favorites.");
    res.redirect("/inv/favorites");
  } catch (err) {
    next(err);
  }
};


// Build favorite view
exports.buildFavoritesView = async function (req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id;
    const favorites = await favoritesModel.getFavoritesByAccount(account_id);
    const nav = await utilities.getNav();

    res.render("inventory/favorites", {
      title: "My Favorite Vehicles",
      nav,
      favorites: favorites.rows,
      message: req.flash("message") || null,
    });
  } catch (err) {
    next(err);
  }
};


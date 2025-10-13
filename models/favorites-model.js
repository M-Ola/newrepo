const pool = require("../database");

// Add a favorite
async function addFavorite(account_id, inv_id) {
  const sql = `
    INSERT INTO inventory_favorites (account_id, inv_id)
    VALUES ($1, $2)
    ON CONFLICT (account_id, inv_id) DO NOTHING
    RETURNING *`;
  return pool.query(sql, [account_id, inv_id]);
}

// Remove a favorite
async function removeFavorite(account_id, inv_id) {
  const sql = `DELETE FROM inventory_favorites WHERE account_id = $1 AND inv_id = $2`;
  return pool.query(sql, [account_id, inv_id]);
}

// Get all favorites for a user
async function getFavoritesByAccount(account_id) {
  const sql = `
    SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_price
    FROM inventory_favorites f
    JOIN inventory i ON f.inv_id = i.inv_id
    WHERE f.account_id = $1
    ORDER BY f.created_at DESC`;
  return pool.query(sql, [account_id]);
}

async function isFavorite(account_id, inv_id) {
  const sql = `SELECT 1 FROM inventory_favorites WHERE account_id = $1 AND inv_id = $2`;
  const result = await pool.query(sql, [account_id, inv_id]);
  return result.rowCount > 0;
}


module.exports = { addFavorite, removeFavorite, getFavoritesByAccount , isFavorite};

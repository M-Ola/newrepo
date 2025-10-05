const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getVehicleById(inv_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("getVehicleById error:", error);
  }
}





async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING *;
    `;
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0]; // return inserted row
  } catch (error) {
    console.error("Error inserting classification:", error);
    return null;
  }
}



async function addInventory(data) {
  try {
    const sql = `
      INSERT INTO inventory (
        inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles,
        inv_color, classification_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;
    const values = [
      data.inv_make,
      data.inv_model,
      data.inv_year,
      data.inv_description,
      data.inv_image,
      data.inv_thumbnail,
      data.inv_price,
      data.inv_miles,
      data.inv_color,
      data.classification_id,
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting inventory item:", error);
    return null;
  }
}


/* async function updateInventory(data) {
  const sql = `
    UPDATE inventory
    SET inv_make = $1,
        inv_model = $2,
        inv_year = $3,
        inv_description = $4,
        inv_image = $5,
        inv_thumbnail = $6,
        inv_price = $7,
        inv_miles = $8,
        inv_color = $9,
        classification_id = $10
    WHERE inv_id = $11
    RETURNING *;
  `;
  const values = [
    data.inv_make,
    data.inv_model,
    data.inv_year,
    data.inv_description,
    data.inv_image,
    data.inv_thumbnail,
    data.inv_price,
    data.inv_miles,
    data.inv_color,
    data.classification_id,
    data.inv_id,
  ];
  return await pool.query(sql, values).then((result) => result.rowCount);
} */

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


async function getInventoryItemById(inv_id) {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1";
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching inventory item by ID:", error);
    throw error;
  }
}



/* ***************************
 *  Delete Inventory 
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data.rowCount; // returns 1 if successful, 0 if not
  } catch (error) {
    new error("Delete Inventory Error");
    
  }
}



module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory, updateInventory, deleteInventoryItem, getInventoryItemById};





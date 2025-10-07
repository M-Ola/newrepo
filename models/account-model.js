
const pool = require("../database/")

async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

async function accountLogin(account_email, account_password,){
  try {
    const sql = "INSERT INTO account (account_email, account_password, account_type) VALUES ($1, $2, 'Client') RETURNING *"
    return await pool.query(sql, [account_email, account_password])
  } catch (error) {
    return error.message
  }
}




/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}


/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}



/* *****************************
* Return account data by clientId
* ***************************** */
/* async function getClientById(clientId) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email FROM account WHERE account_id = $1",
      [clientId]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
} */


/* async function updateAccount(
  accountId,
  first_name,
  last_name,
  email,
  password
) {
  let sql, params;
  if (password) {
    sql = `UPDATE account 
           SET first_name=$1, last_name=$2, email=$3, password=$4 
           WHERE account_id=$5`;
    params = [first_name, last_name, email, password, accountId];
  } else {
    sql = `UPDATE account 
           SET first_name=$1, last_name=$2, email=$3 
           WHERE account_id=$4`;
    params = [first_name, last_name, email, accountId];
  }
  await pool.query(sql, params);
} */




/* async function getAccountById(accountId) {
  const sql = `SELECT account_id, account_firstname, account_lastname, account_email, account_type
               FROM public.account
               WHERE account_id = $1`;
  const data = await pool.query(sql, [accountId]);
  return data.rows[0];
}
 */


/* async function updateAccountInfo(accountId, { firstname, lastname, email }) {
  const sql = `UPDATE public.account
               SET account_firstname = $1, account_lastname = $2,  account_email = $3
               WHERE account_id = $4`;
  const result = await pool.query(sql, [
    firstname,
    lastname,
    email,
    accountId,
  ]);
  return result.rowCount > 0;
} */

async function getAccountById(account_id) {
  const sql = "SELECT * FROM account WHERE account_id = $1";
  const result = await pool.query(sql, [account_id]);
  return result.rows[0];
}

async function updateAccountInfo(
  account_id,
  { account_firstname, account_lastname, account_email }
) {
  const sql = `
    UPDATE account
    SET account_firstname = $1,
        account_lastname = $2,
        account_email = $3
    WHERE account_id = $4
    RETURNING *;
  `;
  const result = await pool.query(sql, [
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  ]);
  return result.rowCount > 0;
}

async function updatePassword(account_id, hashedPassword) {
  const sql = `
    UPDATE account
    SET account_password = $1
    WHERE account_id = $2
    RETURNING *;
  `;
  const result = await pool.query(sql, [hashedPassword, account_id]);
  return result.rowCount > 0;
}









/* async function updatePassword(accountId, hashedPassword) {
  const sql = `UPDATE public.account
               SET password = $1
               WHERE account_id = $2`;
  const result = await pool.query(sql, [hashedPassword, accountId]);
  return result.rowCount > 0;
} */

 



module.exports = {registerAccount, checkExistingEmail, accountLogin, getAccountByEmail, getAccountById,updateAccountInfo, updatePassword}
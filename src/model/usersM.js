const pool = require("../config/db");

const getUsers = async () => {
  return new Promise((resolve, reject) => {
    console.log("Model: Get users");
    pool.query(`SELECT * FROM users`, (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const getUsersByEmail = async (email) => {
  return new Promise((resolve, reject) => {
    console.log("Model: Get users by email");
    pool.query(
      `SELECT * FROM users WHERE email = '${email}'`,
      (err, results) => {
        if (!err) {
          resolve(results);
        } else {
          reject(err);
        }
      }
    );
  });
};

const regis = async (post) => {
  return new Promise((resolve, reject) => {
    console.log("Model: Post/regis users");
    const { name, email, pass, photos, role, public_id } = post;
    pool.query(
      `INSERT INTO users (name, email, pass, photos, role, public_id) VALUES ('${name}', '${email}', '${pass}','${photos}', '${role}', '${public_id}') RETURNING *`,
      (err, results) => {
        if (!err) {
          resolve(results);
        } else {
          reject(err);
        }
      }
    );
  });
};

const delUserById = async (id) => {
  return new Promise((resolve, reject) => {
    console.log("Model: Delete users");
    pool.query(
      `DELETE FROM users WHERE id = ${id} RETURNING *`,
      (err, results) => {
        if (!err) {
          resolve(results);
        } else {
          reject(err);
        }
      }
    );
  });
};

const putUsersById = async (post) => {
  return new Promise((resolve, reject) => {
    console.log("Model: Put users");
    const { name, email, photos, pass, public_id, id } = post;
    pool.query(
      `UPDATE users SET name = '${name}', email = '${email}', photos = '${photos}', pass = '${pass}', public_id = '${public_id}' WHERE id = ${id} RETURNING *`,
      (err, results) => {
        if (!err) {
          resolve(results);
        } else {
          reject(err);
        }
      }
    );
  });
};

const getUsersById = async (id) => {
  return new Promise((resolve, reject) => {
    console.log("Model: Get users by ID");
    pool.query(`SELECT * FROM users WHERE id = ${id}`, (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

module.exports = {
  getUsers,
  getUsersByEmail,
  regis,
  delUserById,
  getUsersById,
  putUsersById,
};

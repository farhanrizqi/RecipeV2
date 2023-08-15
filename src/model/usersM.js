const Pool = require("../config/db");

const getUsers = () => {
  return new Promise((resolve, reject) => {
    Pool.query("SELECT * FROM users;", (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  });
};

const getUserByEmail = async (email) => {
  console.log("model getUserByEmail");
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM users WHERE email='${email}'`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};
const getSearchUsers = (data) => {
  const { search, searchBy, offset, limit, order } = data;
  return new Promise((resolve, reject) => {
    Pool.query(
      `SELECT * FROM users WHERE ${searchBy} ILIKE '%${search}%' ORDER BY id ${order} OFFSET ${offset} LIMIT ${limit} `,
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          reject(err);
        }
      }
    );
  });
};

const getSortUsers = (data) => {
  const { search, searchBy } = data;
  return new Promise((resolve, reject) => {
    Pool.query(
      `SELECT COUNT(*)
FROM (
        SELECT users.id
        FROM users
        WHERE ${searchBy} ILIKE '%${search}%'
    ) AS queryData`,
      (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          reject(err);
        }
      }
    );
  });
};

const createUser = async (data) => {
  let { name, email, pass, role, photos, public_id } = data;
  console.log("model createUser");
  return new Promise((resolve, reject) =>
    Pool.query(
      `INSERT INTO users (name, email, pass, role, photos, public_id, created_at) VALUES('${name}','${email}','${pass}', '${role}','${photos}', '${public_id}', NOW())`,
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    )
  );
};

const putUsers = async (data, id) => {
  const { name, email, pass, role, photos, public_id } = data;
  if (pass) {
    try {
      const res = Pool.query(
        `UPDATE users SET name = $1, email = $2, pass = $3, role = $4, photos = $5, public_id = $6, updated_at = NOW()  WHERE id = $7`,
        [name, email, pass, role, photos, public_id, id]
      );
      return res;
    } catch (e) {
      throw e;
    }
  } else {
    try {
      const res = Pool.query(
        `UPDATE users SET name = $1, email = $2, photo = $3, updated_at = $4 WHERE id = $5`,
        [name, email, role, photos, updated_at, id]
      );
      return res;
    } catch (e) {
      return e;
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  getSearchUsers,
  getSortUsers,
  getUserByEmail,
  createUser,
  putUsers,
};

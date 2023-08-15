const Pool = require("../config/db");

const getRecipeAll = async () => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT recipe.id, recipe.title, recipe.ingredients, recipe.img, category.name AS category, users.name AS author, users.photos AS author_pic FROM recipe JOIN category ON recipe.category_id = category.id JOIN users ON recipe.users_id = users.id`,
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

const getRecipe = async (data) => {
  const { search, searchBy, offset, limit } = data;
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT recipe.id, recipe.title, recipe.ingredients, recipe.img, category.name AS category FROM recipe JOIN category ON recipe.category_id = category.id WHERE ${searchBy} ILIKE '%${search}%' OFFSET ${offset} LIMIT ${limit}`,
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

const getRecipeCount = async (data) => {
  const { search, searchBy, offset, limit } = data;
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT COUNT(*) FROM recipe JOIN category ON recipe.category_id = category.id WHERE ${searchBy} ILIKE '%${search}%'`,
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

const postRecipe = async (data) => {
  const { title, ingredients, category_id, img, users_id, public_id } = data;
  console.log(data);

  const query = {
    text: "INSERT INTO recipe (title, ingredients, category_id, img, users_id, public_id) VALUES ($1, $2, $3, $4, $5, $6)",
    values: [title, ingredients, category_id, img, users_id, public_id],
  };

  return new Promise((resolve, reject) =>
    Pool.query(query, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const putRecipe = async (data, id) => {
  const { title, ingredients, category_id, img } = data;
  console.log("model postRecipe");
  return new Promise((resolve, reject) =>
    Pool.query(
      `UPDATE recipe SET title='${title}', ingredients='${ingredients}', category_id = ${category_id}, img ='${img}' WHERE id=${id}`,
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

const getRecipeById = async (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT recipe.id, recipe.title, recipe.ingredients, recipe.img, category.name AS category, users.name AS author, users.photos AS author_pic FROM recipe JOIN category ON recipe.category_id = category.id JOIN users ON recipe.users_id = users.id WHERE recipe.id = ${id}`,
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

const deleteById = async (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`DELETE FROM recipe WHERE id=${id}`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

module.exports = {
  getRecipe,
  getRecipeById,
  deleteById,
  postRecipe,
  putRecipe,
  getRecipeAll,
  getRecipeCount,
};

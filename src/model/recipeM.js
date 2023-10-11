const Pool = require("../config/db");

const getRecipe = async () => {
  return new Promise((resolve, reject) => {
    console.log("Model: Get recipe");
    Pool.query(
      `SELECT recipe.id, recipe.title, recipe.ingredients, recipe.img, category.name AS category, users.name AS author, users.photos AS author_photos, recipe.created_at
    FROM recipe JOIN category ON recipe.category_id = category.id JOIN users ON recipe.users_id = users.id ORDER BY recipe.id;`,
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

const getRecipeById = async (id) => {
  return new Promise((resolve, reject) => {
    console.log("Model: Get recipe by ID");
    Pool.query(
      `SELECT recipe.users_id, recipe.title, recipe.img, recipe.ingredients, recipe.public_id, recipe.created_at, recipe.category_id, category.name AS category, users.name AS author FROM recipe JOIN category ON recipe.category_id = category.id JOIN users ON recipe.users_id = users.id WHERE recipe.id = ${id}`,
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

const postRecipe = async (post) => {
  return new Promise((resolve, reject) => {
    console.log("Model: Post recipe");
    const { title, img, ingredients, category_id, users_id, public_id } = post;
    Pool.query(
      `INSERT INTO recipe (title, img, ingredients, category_id, users_id, public_id) VALUES ('${title}', '${img}', '${ingredients}', ${category_id}, ${users_id}, '${public_id}') RETURNING *`,
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

const putRecipeById = async (post) => {
  return new Promise((resolve, reject) => {
    console.log("Model: Put recipe");
    const { title, img, ingredients, category_id, public_id, id } = post;
    Pool.query(
      `UPDATE recipe SET title = '${title}', ingredients = '${ingredients}', category_id = ${category_id}, img = '${img}', public_id = '${public_id}' WHERE id = ${id} RETURNING *`,
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

const delRecipeById = async (id) => {
  return new Promise((resolve, reject) => {
    console.log("Model: Delete recipe");
    Pool.query(
      `DELETE FROM recipe WHERE id = ${id} RETURNING *`,
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

const sortRecipe = async (post, userFilter = false) => {
  return new Promise((resolve, reject) => {
    console.log("Model: Sorting recipes");

    const {
      sortBy = "created_at",
      order = "ASC",
      offset,
      limit,
      searchBy = "title",
      search = "",
    } = post;

    const whereClause = userFilter ? `WHERE users_id = ${userFilter}` : "";
    const orderByClause = `ORDER BY ${sortBy} ${order}`;

    const query = `
      SELECT
        recipe.id,
        recipe.users_id,
        recipe.title,
        recipe.img,
        recipe.ingredients,
        category.name AS category,
        users.name,
        users.photos,
        recipe.created_at
      FROM
        recipe
      JOIN
        category ON recipe.category_id = category.id
      JOIN
        users ON recipe.users_id = users.id
      ${whereClause}
      ${search ? `AND ${searchBy} ILIKE '%${search}%'` : ""}
      ${orderByClause}
      OFFSET ${offset}
      LIMIT ${limit}
    `;

    Pool.query(query, (err, results) => {
      if (!err) {
        const data = {
          count: results.rowCount,
          rows: results.rows,
        };
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
};

const getRecipeByUser = async (id) => {
  return new Promise((resolve, reject) => {
    console.log("Model: Get recipe by ID");
    Pool.query(
      `SELECT recipe.title, recipe.img, recipe.ingredients, recipe.public_id, recipe.created_at, category.name AS category, users.name AS author FROM recipe JOIN category ON recipe.category_id = category.id JOIN users ON recipe.users_id = users.id WHERE recipe.users_id = ${id}`,
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

module.exports = {
  getRecipe,
  getRecipeById,
  postRecipe,
  putRecipeById,
  delRecipeById,
  sortRecipe,
  getRecipeByUser,
};

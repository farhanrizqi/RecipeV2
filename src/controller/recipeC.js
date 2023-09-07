const {
  getRecipe,
  getRecipeById,
  postRecipe,
  putRecipeById,
  delRecipeById,
  sortRecipe,
  getRecipeByUser,
} = require("../model/recipeM");
const { responseHandler } = require("../helpers/responseHandler");
const cloudinary = require("../config/photos");

const recipeController = {
  showRecipeOnly: async (req, res) => {
    console.log("Control: Running get recipe");
    try {
      const result = await getRecipe();
      if (result.rowCount > 0) {
        console.log(result.rows);
        res.setHeader("Content-Type", "application/json"); // Set header Content-Type ke application/json
        return res
          .status(200)
          .json(responseHandler(true, result.rows, "Success!"));
      } else {
        console.log("Data not Found");
        res.setHeader("Content-Type", "application/json"); // Set header Content-Type ke application/json
        return res
          .status(404)
          .json(responseHandler(false, null, `Couldn't find the data`, 404));
      }
    } catch (error) {
      console.error(`Error : ${error.message}`);
      res.setHeader("Content-Type", "application/json"); // Set header Content-Type ke application/json
      return res
        .status(500)
        .json(responseHandler(false, null, `Something's wrong`, 500));
    }
  },

  showRecipeById: async (req, res) => {
    console.log("Control: Running get recipe");
    try {
      const { id } = req.params;
      const result = await getRecipeById(id);

      let statusCode, success, data, message;

      if (result.rowCount > 0) {
        statusCode = 200;
        success = true;
        data = result.rows;
        message = "Success!";
      } else {
        statusCode = 404;
        success = false;
        data = null;
        message = `Couldn't find the data`;
      }

      res.setHeader("Content-Type", "application/json");

      return res
        .status(statusCode)
        .json(responseHandler(success, data, message));
    } catch (error) {
      console.error(`Error : ${error.message}`);
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json(responseHandler(false, null, `Something's wrong`, 500));
    }
  },

  showRecipeByUser: async (req, res) => {
    console.log("Control: Running get recipe by User");
    try {
      const { id } = req.params;
      const result = await getRecipeByUser(id);

      let statusCode, success, data, message;

      if (result.rowCount > 0) {
        statusCode = 200;
        success = true;
        data = result.rows;
        message = "Success!";
      } else {
        statusCode = 404;
        success = false;
        data = null;
        message = "Data not found";
      }

      res.setHeader("Content-Type", "application/json");

      return res
        .status(statusCode)
        .json(responseHandler(success, data, message));
    } catch (error) {
      console.error(`Error : ${error.message}`);
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json(responseHandler(false, null, "Something's wrong", 500));
    }
  },

  postRecipe: async (req, res) => {
    console.log("Control: Running post recipe");
    try {
      const { title, ingredients, category_id } = req.body;
      let users_id = req.payload.id;
      console.log(users_id);

      let post = {
        title: title,
        ingredients: ingredients,
        category_id: category_id,
        users_id,
      };

      // setting untuk agar ketika tidak ada gambar diupload
      if (req.file) {
        const result_up = await cloudinary.uploader.upload(req.file.path, {
          folder: "recipe",
        });
        console.log(result_up);

        post.img = result_up.secure_url;
        post.public_id = result_up.public_id;
      } else {
        post.img =
          "https://res.cloudinary.com/ddrecezrk/image/upload/v1693994629/mqfwooucms9zpmgj4sby.png";
        post.public_id = "no-image";
      }

      const result = await postRecipe(post);

      let statusCode, success, data, message;

      if (result.rowCount > 0) {
        statusCode = 200;
        success = true;
        data = result.rows;
        message = "Success!";
      } else {
        statusCode = 404;
        success = false;
        data = null;
        message = "Data not found";
      }

      res.setHeader("Content-Type", "application/json");

      return res
        .status(statusCode)
        .json(responseHandler(success, data, message));
    } catch (error) {
      console.error(`Error : ${error.message}`);
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json(responseHandler(false, null, "Something's wrong", 500));
    }
  },

  putRecipe: async (req, res) => {
    console.log("Control: Running put recipe");
    try {
      const { id } = req.params;
      const { title, ingredients, category_id } = req.body;

      let dataRecipe = await getRecipeById(id);
      console.log(dataRecipe);
      let result_up = null;

      if (req.file) {
        // Jika req.file ada, upload gambar baru dan delete gambar lama
        result_up = await cloudinary.uploader.upload(req.file.path, {
          folder: "recipe",
        });
        await cloudinary.uploader.destroy(dataRecipe.rows[0].public_id);
      }

      // Gunakan data yang ada jika tidak ada data baru
      const updatedTitle = title || dataRecipe.rows[0].title;
      const updatedIngredients = ingredients || dataRecipe.rows[0].ingredients;
      const updatedCategory = category_id || dataRecipe.rows[0].category_id;

      let post = {
        id: id,
        title: updatedTitle,
        ingredients: updatedIngredients,
        category_id: updatedCategory,
      };

      if (result_up) {
        // Jika gambar baru diupload, update properti img
        post.img = result_up.secure_url;
        post.public_id = result_up.public_id;
      } else {
        // Jika tidak ada gambar baru diupload, ambil gambar yang masih ada
        post.img = dataRecipe.rows[0].img;
        post.public_id = dataRecipe.rows[0].public_id;
      }

      let users_id = req.payload.id;

      if (users_id != dataRecipe.rows[0].users_id) {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(404)
          .json(responseHandler(false, null, "This is not your post!", 404));
      }

      const result = await putRecipeById(post);
      res.setHeader("Content-Type", "application/json");
      if (result.rowCount > 0) {
        console.log(result.rows);
        return res
          .status(200)
          .json(responseHandler(true, result.rows, "Success!"));
      } else {
        console.log("Data not found");
        return res
          .status(404)
          .json(responseHandler(false, null, `Couldn't find the data`, 404));
      }
    } catch (error) {
      console.error(error);
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json(responseHandler(false, null, `Something's wrong`, 500));
    }
  },

  deleteRecipe: async (req, res) => {
    console.log("Control: Running delete recipe");
    try {
      const { id } = req.params;

      let dataRecipe = await getRecipeById(id);
      let users_id = req.payload.id;

      if (users_id != dataRecipe.rows[0].users_id) {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(404)
          .json(responseHandler(false, null, "This is not your post!", 404));
      }

      const result = await delRecipeById(id);
      res.setHeader("Content-Type", "application/json");
      if (result.rowCount > 0) {
        await cloudinary.uploader.destroy(dataRecipe.rows[0].public_id);
        console.log(result.rows);
        return res
          .status(200)
          .json(responseHandler(true, result.rows, "Success!"));
      } else {
        console.log("Data not found");
        return res
          .status(404)
          .json(responseHandler(false, null, `Couldn't find the data`, 404));
      }
    } catch (error) {
      console.error(`Error : ${error.message}`);
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json(responseHandler(false, null, `Something's wrong`, 500));
    }
  },

  sortRecipe: async (req, res) => {
    console.log("Control: Running sort and search recipe");
    try {
      const { sortBy, order, limit, searchBy, search, users_id } = req.query;
      let page = parseInt(req.query.page) || 1;
      let limiter = limit || 5;

      const post = {
        sortBy: sortBy || "created_at",
        order: order || "ASC",
        limit: limit || 5,
        offset: (page - 1) * limiter,
        searchBy: searchBy || "title",
        search: search || "",
      };

      const userFilter = users_id || false;

      const resultTotal = await getRecipe();
      const result = await sortRecipe(post, userFilter);

      let pagination = {
        totalPage: Math.ceil(resultTotal.rowCount / limiter),
        totalData: parseInt(result.count),
        pageNow: page,
      };

      if (result.rows.length > 0) {
        console.log(result.rows);
        res.setHeader("Content-Type", "application/json");
        return res
          .status(200)
          .json(responseHandler(true, result.rows, pagination));
      } else {
        console.log("Data not found");
        res.setHeader("Content-Type", "application/json");
        return res
          .status(404)
          .json(responseHandler(false, null, `Couldn't find the data`, 404));
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json(responseHandler(false, null, `Something's wrong`, 500));
    }
  },
};

module.exports = recipeController;

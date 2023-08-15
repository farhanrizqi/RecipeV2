const {
  getRecipe,
  getRecipeById,
  deleteById,
  postRecipe,
  putRecipe,
  getRecipeAll,
  getRecipeCount,
} = require("../model/recipeM");
const cloudinary = require("../config/photos");
const { validationResult } = require("express-validator");

const recipeController = {
  getDataDetail: async (req, res, next) => {
    const { search, searchBy, limit } = req.query;

    let page = req.query.page || 1;
    let limiter = limit || 5;

    data = {
      search: search || "",
      searchBy: searchBy || "title",
      offset: (page - 1) * limiter,
      limit: limit || 5,
    };
    let dataRecipe = await getRecipe(data);
    let dataRecipeCount = await getRecipeCount(data);

    let pagination = {
      totalPage: Math.ceil(dataRecipeCount.rows[0].count / limiter),
      totalData: parseInt(dataRecipeCount.rows[0].count),
      pageNow: parseInt(page),
    };

    console.log("dataRecipe");
    console.log(dataRecipe);
    console.log("total data");
    console.log(dataRecipeCount.rows[0].count);
    if (dataRecipe) {
      res.status(200).json({
        status: 200,
        message: "get data recipe success",
        data: dataRecipe.rows,
        pagination,
      });
    }
  },
  getData: async (req, res, next) => {
    let dataRecipe = await getRecipeAll();
    console.log("dataRecipe");
    console.log(dataRecipe);
    if (dataRecipe) {
      res.status(200).json({
        status: 200,
        message: "get data recipe success",
        data: dataRecipe.rows,
      });
    }
  },
  getDataById: async (req, res, next) => {
    const { id } = req.params;

    if (!id || id <= 0 || isNaN(id)) {
      return res.status(404).json({ message: "Wrong ID" });
    }

    let dataRecipeId = await getRecipeById(parseInt(id));

    console.log("dataRecipe");
    console.log(dataRecipeId);

    if (!dataRecipeId.rows[0]) {
      return res
        .status(200)
        .json({ status: 200, message: "get data recipe not found", data: [] });
    }

    return res.status(200).json({
      status: 200,
      message: "get data recipe success",
      data: dataRecipeId.rows[0],
    });
  },
  deleteDataById: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id || id <= 0 || isNaN(id)) {
        return res.status(404).json({ message: "Wrong ID" });
      }

      let dataRecipeId = await getRecipeById(parseInt(id));

      let users_id = req.payload.id;
      // let role = req.payload.role;

      console.log("Data ID");
      console.log(users_id);
      console.log(dataRecipeId.rows[0].users_id);
      if (users_id != dataRecipeId.rows[0].users_id) {
        return res.status(404).json({ message: "You're not authorized" });
      }

      let result = await deleteById(parseInt(id));
      console.log(result);
      if (result.rowCount == 0) {
        throw new Error("DELETE data failed");
      }
      return res.status(200).json({
        status: 200,
        message: "DELETE data success",
        data: result.rows[0],
      });
    } catch (err) {
      return res.status(404).json({ status: 404, message: err.message });
    }
  },
  postData: async (req, res, next) => {
    const { title, ingredients, category_id } = req.body;
    console.log(req.body);

    if (!req.isFileValid) {
      return res.status(400).json({ message: req.isFileValidMessage });
    }

    try {
      const ImageCloud = await cloudinary.uploader.upload(req.file.path, {
        folder: "recipe",
      });

      if (!ImageCloud) {
        return res.status(404).json({ message: "Failed to upload image" });
      }

      let users_id = req.payload.id;
      console.log("payload");
      console.log(req.payload);

      if (!title || !ingredients || !category_id) {
        return res
          .status(400)
          .json({ message: "Input title, ingredients, category" });
      }

      let data = {
        title: title,
        ingredients: ingredients,
        category_id: parseInt(category_id),
        users_id: req.payload.id,
        img: ImageCloud.secure_url,
        public_id: ImageCloud.public_id,
      };

      // Save data to the database
      let result = await postRecipe(data);

      return res
        .status(200)
        .json({ status: 200, message: "Add data success", data });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Failed to upload image to Cloudinary" });
    }
  },

  putData: async (req, res, next) => {
    const { id } = req.params;
    const { title, ingredients, category_id } = req.body;

    if (!id || id <= 0 || isNaN(id)) {
      return res.status(404).json({ message: "Wrong ID" });
    }

    let dataRecipeId = await getRecipeById(parseInt(id));
    let users_id = req.payload.id;

    // Check if a new image file is uploaded
    if (req.file) {
      // Delete the old image from Cloudinary
      if (dataRecipeId.rows[0].img) {
        const public_id = dataRecipeId.rows[0].img
          .split("/")
          .pop()
          .split(".")[0];
        await cloudinary.uploader.destroy(public_id);
      }

      // Upload the new image to Cloudinary
      const ImageCloud = await cloudinary.uploader.upload(req.file.path, {
        folder: "recipe",
      });

      if (!ImageCloud) {
        return res.status(404).json({ message: "Upload image failed" });
      }

      console.log("id data");
      console.log(users_id);
      console.log(dataRecipeId.rows[0].users_id);
      if (users_id != dataRecipeId.rows[0].users_id) {
        return res.status(404).json({ message: "You're not authorized" });
      }

      console.log("put data");
      console.log(dataRecipeId.rows[0]);

      // Update data with the new image URL
      let data = {
        title: title || dataRecipeId.rows[0].title,
        ingredients: ingredients || dataRecipeId.rows[0].ingredients,
        category_id: parseInt(category_id) || dataRecipeId.rows[0].category_id,
        img: ImageCloud.secure_url,
      };

      let result = putRecipe(data, id);
      console.log(result);
      delete data.id;
      return res
        .status(200)
        .json({ status: 200, message: "Update success", data });
    } else {
      // No new image, keep the old one
      console.log("Data ID");
      console.log(users_id);
      console.log(dataRecipeId.rows[0].users_id);
      if (users_id != dataRecipeId.rows[0].users_id) {
        return res.status(404).json({ message: "You're not authorized" });
      }

      console.log("Edited data :");
      console.log(dataRecipeId.rows[0]);

      let data = {
        title: title || dataRecipeId.rows[0].title,
        ingredients: ingredients || dataRecipeId.rows[0].ingredients,
        category_id: parseInt(category_id) || dataRecipeId.rows[0].category_id,
        img: dataRecipeId.rows[0].img, // Keep the existing image URL if no new image is uploaded
      };

      let result = await putRecipe(data, parseInt(id)); // Tunggu hasil dari putRecipe
      console.log(result);

      delete data.id;

      return res
        .status(200)
        .json({ status: 200, message: "Update data success", data });
    }
  },
};

module.exports = recipeController;

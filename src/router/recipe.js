// const express = require("express");
// const router = express.Router();
// const upload = require("./../middleware/uploadImages");
// const { Protect } = require("./../middleware/protect");
// const {
//   getData,
//   getDataById,
//   deleteDataById,
//   postData,
//   putData,
//   getDataDetail,
// } = require("../controller/recipeC");
// const xss = require("xss-clean");

// // Middleware untuk membersihkan input dari XSS
// router.use(xss());

// // Rute untuk mendapatkan semua data
// router.get("/", Protect, getData);

// // Rute untuk mendapatkan detail data
// router.get("/detail", getDataDetail);

// // Rute untuk menambahkan data baru
// router.post("/", Protect, upload.single("img"), postData);

// // Rute untuk memperbarui data berdasarkan ID
// router.put("/:id", Protect, upload.single("img"), putData);

// // Rute untuk mendapatkan data berdasarkan ID
// router.get("/:id", getDataById);

// // Rute untuk menghapus data berdasarkan ID
// router.delete("/:id", Protect, deleteDataById);

// module.exports = router;

const {
  showRecipeOnly,
  postRecipe,
  putRecipe,
  deleteRecipe,
  sortRecipe,
  showRecipeById,
  showRecipeByUser,
} = require("../controller/recipeC");
const app = require("express");
const router = app.Router();
const { protect } = require("../middleware/jwt");
const upload = require("../middleware/uploadImages");

router.get("/", showRecipeOnly);
router.post("/", protect, upload.single("img"), postRecipe);
router.put("/:id", protect, upload.single("img"), putRecipe);
router.delete("/:id", protect, deleteRecipe);
router.get("/id/:id", showRecipeById);
router.get("/users/:id", showRecipeByUsers);
router.get("/spc", sortRecipe);

module.exports = router;

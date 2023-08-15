const {
  getData,
  getDataById,
  deleteDataById,
  postData,
  putData,
  getDataDetail,
} = require("../controller/recipeC");
const express = require("express");
const router = express.Router();
const upload = require("./../middleware/uploadImages");
const { Protect } = require("./../middleware/protect");
const xss = require("xss-clean");
const validateImage = require("./../middleware/validateImages");

router.use(xss());

router.get("/", Protect, getData);
router.get("/detail", getDataDetail);
router.post("/", Protect, validateImage, upload.single("img"), postData);
router.put("/:id", Protect, validateImage, upload.single("img"), putData);
router.get("/:id", getDataById);
router.delete("/:id", Protect, deleteDataById);

module.exports = router;

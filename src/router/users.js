const {
  getData,
  getSpecData,
  putData,
  login,
  regis,
} = require("../controller/usersC");
const express = require("express");
const router = express.Router();
const upload = require("./../middleware/uploadImages");
// const xss = require("xss-clean");
const validateImage = require("./../middleware/validateImages");

router.get("/", getData);
router.get("/spc", getSpecData);
router.post("/regis", validateImage, upload.single("photos"), regis);
router.post("/login", login);
router.put("/:id", validateImage, upload.single("photos"), putData);

module.exports = router;

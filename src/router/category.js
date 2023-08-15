const { getData } = require("../controller/categoryC");
const express = require("express");
const router = express.Router();

router.get("/", getData);

module.exports = router;

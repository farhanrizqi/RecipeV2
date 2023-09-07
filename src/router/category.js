const { getData } = require("../controller/categoryC");
const app = require("express");
const router = app.Router();

router.get("/", getData);

module.exports = router;

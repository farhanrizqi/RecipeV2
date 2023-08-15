const app = require("express");
const router = app.Router();
const recipe = require("./recipe");
const category = require("./category");
const users = require("./users");

router.use("/recipe", recipe);
router.use("/category", category);
router.use("/users", users);

module.exports = router;

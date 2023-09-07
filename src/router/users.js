const {
  showUsersOnly,
  registerUsers,
  login,
  delUsersByIdOnly,
  showUsersById,
  putUsersByIdOnly,
} = require("../controller/usersC");
const app = require("express");
const router = app.Router();
const { protect } = require("../middleware/jwt");
const upload = require("../middleware/uploadImages");

router.get("/", protect, showUsersOnly);
router.post("/regis", upload.single("photos"), registerUsers);
router.post("/login", login);
router.delete("/:id", protect, delUsersByIdOnly);
router.get("/:id", showUsersById);
router.put("/:id", protect, upload.single("photos"), putUsersByIdOnly);

module.exports = router;

const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".png");
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image.jfif"
    ) {
      cb(null, true);
      req.isFileValid = true;
    } else {
      req.isFileValid = false;
      req.isFileValidMessage = "Input must be an image file";
      cb(null, false);
    }
  },
});

module.exports = upload;

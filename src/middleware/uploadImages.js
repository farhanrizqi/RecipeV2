const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExt = file.originalname.split(".").pop(); // Mendapatkan ekstensi file
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExt);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // Batasan ukuran file
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/png", "image/jpg", "image/jpeg", "image/jfif"];
    const fileExt = file.originalname.split(".").pop().toLowerCase(); // Mendapatkan ekstensi file
    if (
      allowedMimes.includes(file.mimetype) &&
      (fileExt === "png" ||
        fileExt === "jpg" ||
        fileExt === "jpeg" ||
        fileExt === "jfif")
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

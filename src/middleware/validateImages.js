const { body } = require("express-validator");

const validateImage = [
  body("img")
    .custom((value, { req }) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/svg",
      ];
      const maxSize = 1024 * 1024; // 1MB

      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new Error("Invalid Image Format");
      }

      if (req.file.size > maxSize) {
        throw new Error("Image size exceeds the limit (1MB)");
      }

      return true;
    })
    .withMessage("Invalid Image Format or size exceeds the limit (1MB)"),
];

module.exports = validateImage;

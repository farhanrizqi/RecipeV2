// const cloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.IMG_NAME,
  api_key: process.env.IMG_KEY,
  api_secret: process.env.IMG_SECRET,
});

// const storage = cloudinaryStorage({
//   cloudinary: cloudinary,
//   folder: "recipe", // Nama folder di cloudinary
//   allowedFormats: ["jpg", "png", "gif"],
// });

module.exports = cloudinary;

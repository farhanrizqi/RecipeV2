const jwt = require("jsonwebtoken");
require("dotenv").config();

const GenerateToken = (data) => {
  const payload = {
    id: data.id,
    name: data.name,
    role: data.role,
    email: data.email,
    photos: data.photos
  };
  const token = jwt.sign(payload, process.env.JWT_TOKEN);
  return token;
};

module.exports = { GenerateToken };

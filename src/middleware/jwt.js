const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (data) => {
  const payload = {
    id: data.id,
    name: data.name,
    role: data.role,
    email: data.email,
    photos: data.photos,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

const protect = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const bearer = authorization.split(" ");
    const decoded = await jwt.verify(bearer[1], process.env.JWT_SECRET);
    req.payload = decoded;
    next();
  } catch (err) {
    return res.status(404).json({ status: 404, message: "Wrong token", err });
  }
};

module.exports = {
  generateToken,
  protect,
};

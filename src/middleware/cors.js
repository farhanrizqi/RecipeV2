// middleware/cors.js
const Cors = require("cors");

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Atur metode yang diizinkan
  credentials: true, // Izinkan kredensial (misalnya, cookie) dalam permintaan
  optionsSuccessStatus: 200,
};

const cors = Cors(corsOptions);

module.exports = cors;

const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const router = require("./src/router");
const cors = require("cors");
const helmet = require("./src/middleware/helmet");
const xss = require("./src/middleware/xss");
const morgan = require("./src/middleware/morgan");
require("dotenv").config();

// app use
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Atur metode yang diizinkan
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));
app.use(helmet);
app.use("/img", express.static("assets"));
app.use(morgan);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(xss);
app.use(router);

app.get("/", (req, res) => {
  res.status(200).json({ status: 200, message: "Server is Runnin.." });
});

app.listen(port, () => {
  console.log(`This app is listening on ${port}`);
});

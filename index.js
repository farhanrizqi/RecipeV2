const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const { restart } = require("nodemon");
const morgan = require("morgan");
const router = require("./src/router");
// const { Pool } = require("pg");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./assets/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

// console.log(process.env);
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(xss());
app.use(cors(corsOptions));
app.use(helmet());
app.use("/img", express.static("assets"));
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Recipe API");
});

app.use(router);

app.listen(port, (req, res) => {
  console.log(`This app is listening on ${port}`);
});

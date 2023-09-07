const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const router = require("./src/router");
const cors = require("./src/middleware/cors");
const helmet = require("./src/middleware/helmet");
const xss = require("./src/middleware/xss");
const morgan = require("./src/middleware/morgan");
require("dotenv").config();

// app use
app.use(cors);
app.use(helmet);
app.use("/img", express.static("assets"));
app.use(morgan);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(xss);
app.use(router);

app.get("/", (req, res) => {
  res.send("Recipe API");
});

app.listen(port, () => {
  res.send(`This app is listening on ${port}`);
});

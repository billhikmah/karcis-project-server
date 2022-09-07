const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const bodyParser = require("body-parser");
const mainRouter = require("./src/routes/index");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const corsOptions = {
  origin: [`http://localhost:${port}`],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(helmet()); // Mengamankan Header
app.use(xss());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is Running on port ${port}`);
});

app.use("/api", mainRouter);

app.use("/*", (request, response) => {
  response.status(404).send("Page not found.");
});

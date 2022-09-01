const express = require("express");

const Router = express.Router();

Router.get("/ping", (request, response) => {
  response.status(200).send("Hello World!");
});

module.exports = Router;

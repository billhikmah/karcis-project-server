const express = require("express");

const Router = express.Router();
const authRouter = require("./auth");
const eventRouter = require("./event");
const transactionRouter = require("./transaction");
const userRouter = require("./user");
const wishlistRouter = require("./wishlist");

Router.get("/ping", (request, response) => {
  response.status(200).send("Hello World!");
});

module.exports = Router;

Router.use("/auth", authRouter);
Router.use("/event", eventRouter);
Router.use("/transactions", transactionRouter);
Router.use("/users", userRouter);
Router.use("/wishlist", wishlistRouter);

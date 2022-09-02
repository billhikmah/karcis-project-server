const express = require("express");

const Router = express.Router();
const authRouter = require("./auth");
const bookingRouter = require("./booking");
const eventRouter = require("./event");
const userRouter = require("./user");
const wishlistRouter = require("./wishlist");

Router.get("/ping", (request, response) => {
  response.status(200).send("Hello World!");
});

Router.use("/auth", authRouter);
Router.use("/booking", bookingRouter);
Router.use("/event", eventRouter);
Router.use("/user", userRouter);
Router.use("/wishlist", wishlistRouter);

module.exports = Router;

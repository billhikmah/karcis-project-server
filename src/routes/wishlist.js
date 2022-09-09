const express = require("express");
const wishlistController = require("../controllers/wishlist");
const authMiddleware = require("../middlewares/auth");

const Router = express.Router();

Router.post(
  "/",
  authMiddleware.authentication,
  wishlistController.createWishlist
);
Router.get("/:user_id", wishlistController.getAllWishList);
Router.get("/id/:id", wishlistController.getWishlistById);
Router.delete("/:id", wishlistController.deleteWishlist);

module.exports = Router;

const express = require("express");
const wishlistController = require("../controllers/wishlist");
const authMiddleware = require("../middlewares/auth");

const Router = express.Router();

Router.post(
  "/",
  authMiddleware.authentication,
  wishlistController.createWishlist
);
Router.get(
  "/",
  authMiddleware.authentication,
  wishlistController.getAllWishList
);
Router.get(
  "/:id",
  authMiddleware.authentication,
  wishlistController.getWishlistById
);
Router.delete(
  "/:id",
  authMiddleware.authentication,
  wishlistController.deleteWishlist
);

module.exports = Router;

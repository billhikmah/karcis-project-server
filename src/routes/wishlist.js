const express = require("express");
const wishlistController = require("../controllers/wishlist");

const Router = express.Router();

Router.post("/", wishlistController.createWishlist);
Router.get("/:user_id", wishlistController.getAllWishList);
Router.get("/id/:id", wishlistController.getWishlistById);
Router.delete("/:id", wishlistController.deleteWishlist);

module.exports = Router;

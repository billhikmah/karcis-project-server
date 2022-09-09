const wishlistModel = require("../models/wishlist");
const responseHandler = require("../utils/responseHandler");

const createWishlist = async (req, res) => {
  try {
    const result = await wishlistModel.createWishlist(req.body, req.payload);
    return responseHandler(res, result.status, result.statusText, result.data);
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

const getAllWishList = async (req, res) => {
  try {
    const result = await wishlistModel.getAllWishList(req.query, req.params);
    if (result.data.length === 0) {
      return responseHandler(res, 404, "Data not found.", result.data);
    }
    const pagination = {
      page: +req.query.page,
      limit: +req.query.limit,
      totalData: result.count,
      totalPage: Math.ceil(result.count / req.query.limit),
    };
    return responseHandler(
      res,
      result.status,
      result.statusText,
      result.data,
      pagination
    );
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

const getWishlistById = async (req, res) => {
  try {
    const result = await wishlistModel.getWishlistById(req.params);
    if (result.data.length === 0) {
      return responseHandler(res, 404, "Data not found.", result.data);
    }
    return responseHandler(res, result.status, result.statusText, result.data);
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

const deleteWishlist = async (req, res) => {
  try {
    const result = await wishlistModel.deleteWishlist(req.params);
    if (result.data.length === 0) {
      return responseHandler(res, result.status, "Id not found", result.data);
    }
    return responseHandler(
      res,
      result.status,
      "Wishlist has been deleted",
      result.data
    );
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

module.exports = {
  createWishlist,
  getAllWishList,
  getWishlistById,
  deleteWishlist,
};

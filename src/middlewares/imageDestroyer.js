/* eslint-disable camelcase */
const responseHandler = require("../utils/responseHandler");
const cloudinary = require("../config/cloudinary");
const { getEventById } = require("../models/event");
const { getUserById } = require("../models/user");

const updateEventImage = async (req, res, next) => {
  try {
    if (req.file) {
      const { id } = req.params;
      const getPublicId = await getEventById(id);
      if (getPublicId.data.length === 0) {
        return responseHandler(res, 404, "Event not found.", getPublicId.data);
      }
      // eslint-disable-next-line camelcase
      const public_id = getPublicId.data[0].image || null;
      return cloudinary.uploader
        .destroy(public_id)
        .then(() => {
          next();
        })
        .catch(() => {
          next();
        });
    }
    return next();
  } catch (error) {
    return responseHandler(res, 404, error, null);
  }
};

const deleteEventImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getPublicId = await getEventById(id);
    if (getPublicId.data.length === 0) {
      return responseHandler(res, 404, "Event not found.", getPublicId.data);
    }
    // eslint-disable-next-line camelcase
    const public_id = getPublicId.data[0].image || null;
    return cloudinary.uploader
      .destroy(public_id)
      .then(() => {
        next();
      })
      .catch(() => {
        next();
      });
  } catch (error) {
    return responseHandler(res, 404, error, null);
  }
};

const updateUserImage = async (req, res, next) => {
  try {
    if (req.file) {
      const { user_id } = req.payload;
      const getPublicId = await getUserById(user_id);
      if (getPublicId.data.length === 0) {
        return responseHandler(res, 404, "Event not found.", getPublicId.data);
      }
      // eslint-disable-next-line camelcase
      const public_id = getPublicId.data[0].image || null;
      return cloudinary.uploader
        .destroy(public_id)
        .then(() => {
          next();
        })
        .catch(() => {
          next();
        });
    }
    return next();
  } catch (error) {
    return responseHandler(res, 404, error, null);
  }
};

module.exports = { updateEventImage, deleteEventImage, updateUserImage };

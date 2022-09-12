const responseHandler = require("../utils/responseHandler");
const cloudinary = require("../config/cloudinary");
const { getEventById } = require("../models/event");

const updateEventImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const { id } = req.params;
  const getPublicId = await getEventById(id);
  if (getPublicId.data.length === 0) {
    return responseHandler(res, 404, "Event not found.", getPublicId.data);
  }

  return cloudinary.uploader
    .destroy(getPublicId.data[0].image)
    .then(() => next());
};

const deleteEventImage = async (req, res, next) => {
  const { id } = req.params;
  const getPublicId = await getEventById(id);
  if (getPublicId.data.length === 0) {
    return responseHandler(res, 404, "Event not found.", getPublicId.data);
  }

  return cloudinary.uploader
    .destroy(getPublicId.data[0].image)
    .then(() => next());
};

module.exports = { updateEventImage, deleteEventImage };

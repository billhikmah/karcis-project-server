const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const responseHandler = require("../utils/responseHandler");
const cloudinary = require("../config/cloudinary");

const uploadEventImage = (req, res, next) => {
  if (!req.file) {
    next();
  }
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "karcis-project/events",
      public_id: (_req, file) => {
        const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `event-${file.fieldname}-${suffix}`;
        return filename;
      },
    },
  });

  const limits = {
    fileSize: 2e6,
    files: 1,
  };

  const fileFilter = (_req, file, cb) => {
    const extName = path.extname(file.originalname);
    const allowedExt = /jpeg|jpg|png/;
    if (!allowedExt.test(extName)) {
      return cb(
        new Error(
          "Only images with .jpeg, .jpg, or .png extensions are allowed"
        )
      );
    }
    return cb(null, true);
  };

  const upload = multer({ storage, limits, fileFilter }).single("image");

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return responseHandler(res, 401, err.message, null);
    }
    if (err) {
      return responseHandler(res, 401, err.message, null);
    }
    return next();
  });
};

const uploadUserImage = (req, res, next) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "karcis-project/users",
      public_id: (_req, file) => {
        const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `user-${file.fieldname}-${suffix}`;
        return filename;
      },
    },
  });

  const limits = {
    fileSize: 2e6,
    files: 1,
  };

  const fileFilter = (_req, file, cb) => {
    const extName = path.extname(file.originalname);
    const allowedExt = /jpeg|jpg|png/;
    if (!allowedExt.test(extName)) {
      return cb(
        new Error(
          "Only images with .jpeg, .jpg, or .png extensions are allowed"
        )
      );
    }
    return cb(null, true);
  };

  const upload = multer({ storage, limits, fileFilter }).single("image");

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return responseHandler(res, 401, err.message, null);
    }
    if (err) {
      return responseHandler(res, 401, err.message, null);
    }
    return next();
  });
};

module.exports = { uploadEventImage, uploadUserImage };

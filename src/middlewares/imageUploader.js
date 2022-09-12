// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const path = require("path");
// const responseHandler = require("../utils/responseHandler");
// const cloudinary = require("../config/cloudinary");

// const uploadEventImage = (req, res, next) => {
//   const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//       folder: "karcis-project/events",
//       // public_id: (_req, file) => {
//       //   const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//       //   const filename = `${file.fieldname}-${suffix}${path.extname(
//       //     file.originalname
//       //   )}`;
//       //   return filename;
//       // },
//     },
//   });

//   const limits = {
//     fileSize: 2e6,
//     files: 1,
//   };

//   const fileFilter = (_req, file, cb) => {
//     const extName = path.extname(file.originalname);
//     const allowedExt = /jpeg|jpg|png/;
//     if (!allowedExt.test(extName)) {
//       return cb(
//         new Error(
//           "Only images with .jpeg, .jpg, or .png extensions are allowed"
//         )
//       );
//     }
//     return cb(null, true);
//   };

//   const upload = multer({ storage }).single("image");

//   upload(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred when uploading.
//       console.log(err);
//     } else if (err) {
//       // An unknown error occurred when uploading.
//       console.log(err);
//     }
//     next();
//     // Everything went fine.
//   });
// };

// const uploadUserImage = (req, res, next) => {
//   const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//       folder: "karcis-project/user",
//       public_id: (_req, file) => {
//         const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//         const filename = `${file.fieldname}-${suffix}${path.extname(
//           file.originalname
//         )}`;
//         return filename;
//       },
//     },
//   });

//   const limits = {
//     fileSize: 2e6,
//     files: 1,
//   };

//   const fileFilter = (_req, file, cb) => {
//     const extName = path.extname(file.originalname);
//     const allowedExt = /jpeg|jpg|png/;
//     if (!allowedExt.test(extName)) {
//       return cb(
//         new Error(
//           "Only images with .jpeg, .jpg, or .png extensions are allowed"
//         )
//       );
//     }
//     return cb(null, true);
//   };

//   const upload = multer({ storage, limits, fileFilter }).single("image");

//   upload(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       return responseHandler(res, 401, err.message, null);
//     }
//     if (err) {
//       return responseHandler(res, 401, err.message, null);
//     }
//     return next();
//   });
// };

// module.exports = { uploadEventImage, uploadUserImage };
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const responseHandler = require("../utils/responseHandler");
const cloudinary = require("../config/cloudinary");

module.exports = {
  uploadProduct: (request, response, next) => {
    // console.log(request);
    // JIKA INGIN MENYIMPAN FILE KE FOLDER PROJECT
    // const storage = multer.diskStorage({
    //   destination(req, file, cb) {
    //     cb(null, "public/uploads/product");
    //   },
    //   filename(req, file, cb) {
    //     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    //     // console.log(file);
    //     // file = {
    //     //     fieldname: 'image',
    //     //     originalname: 'Visual Background - Fullstack Webiste-01.png',
    //     //     encoding: '7bit',
    //     //     mimetype: 'image/png'
    //     //   }
    //     // console.log(uniqueSuffix);
    //     // uniqueSuffix = 1662708893973-855005446
    //     cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
    //   },
    // });
    // JIKA INGIN MENYIMPAN KE CLOUNDINARY
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "Event-Organizing/Product",
      },
    });

    const upload = multer({ storage }).single("image");
    console.log("tes");
    upload(request, response, (err) => {
      console.log("tes2");
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log(err.message);
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log(err.message);
      }
      next();
      // Everything went fine.
    });
  },
};

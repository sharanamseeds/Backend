import multer from "multer";
import path from "path";

// // Set up storage engine
// const storage = multer.diskStorage({
//   destination: './uploads/',
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// // Init upload
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 }, // 1MB limit
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   }
// }).single('file');

// // Check file type
// function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
//   const filetypes = /jpeg|jpg|png|gif|pdf/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Error: Images Only!'));
//   }
// }

let upload = multer();

export default upload;

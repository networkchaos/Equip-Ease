// /middleware/upload.js
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // store in 'uploads/' folder
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|heic/;
  const isValidType = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (isValidType) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, PNG images allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB max
  fileFilter: fileFilter,
});

module.exports = upload;

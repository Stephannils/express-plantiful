const multer = require('multer');

// Uploader
const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  fileFilter: function fileFilter(req, file, cb) {
    if (!file.originalname.match(/(.jpeg|.jpg|.png)$/gm)) {
      return cb(new Error('Please upload a PNG, JPG or JPEG', false));
    }
    cb(null, true);
  },
});

module.exports = upload;
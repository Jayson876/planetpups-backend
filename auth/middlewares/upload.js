const path = require("path");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../tmp'));
  },
  filename: function (req, file, cb) {
    console.log('ORIGINAL NAME:',file.originalname);
    const ext = file.mimetype.split('/')[1];
    const fileName = Date.now() + ext;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      console.log('Only jpeg and png files are supported');
      cb(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});

module.exports = upload;

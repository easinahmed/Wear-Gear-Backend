const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middlewares/auth');
const { admin } = require('../middlewares/admin');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const extname = allowed.test(file.mimetype);
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed (jpeg, jpg, png, webp)'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'wear-and-gear' },
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Cloudinary upload failed', error: error.message });
        }
        res.json({ url: result.secure_url, public_id: result.public_id });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;

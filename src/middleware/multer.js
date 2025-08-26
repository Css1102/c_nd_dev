const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dynamic storage logic
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Example: use user ID or type from request to create folder
    const userId = req.user?._id || 'anonymous';
    const folder = path.join(__dirname, '..', 'uploads', toString(userId));

    // Ensure folder exists
    fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    // Example: prefix with field name and timestamp
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueName = `${file.fieldname}-${Date.now()}-${baseName}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = { upload };

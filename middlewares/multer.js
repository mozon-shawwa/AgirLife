const multer = require('multer');
const path = require('path');
const createError = require('http-errors' );

function fileFilter(req, file, cb) {
    const allowedFileTypes = /jpeg|jpg|png|gif/;

    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = allowedFileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(createError(400, 'Only image files are allowed (jpeg, jpg, png, gif).'));
    }
}

const upload = multer({
    storage: multer.memoryStorage(), 
    limits: { fileSize: 2 * 1024 * 1024 }, 
    fileFilter
});

module.exports = upload;
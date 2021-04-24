import multer from 'multer';
import AppError from './appError';

const storage = multer.memoryStorage();
const limits = {
  fileSize: 1024 * 1024
};

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|WEBP|webp)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(
      new AppError('Not an image! Please upload only images', 400),
      false
    );
  }
  cb(null, true);
};

export const singleFile = (req, res, next) => {
  const upload = multer({
    storage,
    limits,
    fileFilter
  }).single('file');

  upload(req, res, (err) => {
    if (err) return next(new AppError(err, 500));
    next();
  });
};

export const multipleFiles = (req, res, next) => {
  const uploads = multer({
    storage,
    limits,
    fileFilter
  }).fields([{ name: 'files', maxCount: 6 }]);

  uploads(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return next(new AppError('Cannot Upload More Than 6 Images', 500));
      }
    }

    if (err) {
      return next(new AppError(err, 500));
    }

    next();
  });
};

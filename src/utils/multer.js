import multer from "multer";

export const fileTypes = {
  image: ["image/png", "image/jpeg", "image/webp"],
  pdf: ["application/pdf"],
};

const fileUpload = (customTypes = []) => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (customTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("invalid format", false);
    }
  };

  const upload = multer({ fileFilter, storage });

  return upload;
};

export default fileUpload;

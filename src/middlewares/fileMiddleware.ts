import multer from "multer";
import { appConfig } from "~/config";
import { normalizeFileName } from "~/utils/normalizeFileName";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, appConfig.app.fileStoragePath);
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().getTime()}-${normalizeFileName(file.originalname)}`);
  },
});

export const fileMilddeware = multer({ storage });

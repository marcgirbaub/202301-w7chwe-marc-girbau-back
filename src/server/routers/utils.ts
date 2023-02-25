import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename(req, file, callback) {
    const suffix = uuidv4();
    const extension =
      file.mimetype.split("/")[file.mimetype.split("/").length - 1];
    callback(null, `${file.originalname.split(".")[0]}-${suffix}.${extension}`);
  },
});

export const upload = multer({ storage, limits: { fileSize: 3000000 } });

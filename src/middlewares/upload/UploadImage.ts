import moment from "moment";
import multer from "multer";
import { BadRequestError } from "../../errors/Errors";
import Messages from "../../errors/Messages";

/**
 * Storage
 */
let storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "public");
  },
  filename: (request, file, callback) => {
    callback(null, getFilename(file));
  },
});

let audioStorage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "audios");
  },
  filename: (request, file, callback) => {
    callback(null, getFilename(file));
  },
});
/**
 * Retrieve Filename
 *
 * @param {File} file
 */
let getFilename = (file: Express.Multer.File) => {
  return `${moment().unix()}-${file.originalname}`;
};

/**
 * Valid Image Mime Types
 */
const MimeTypes = [
  // Images
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/heic",
  "image/heif",
  "image/*", // fallback for all images

  // Documents
  "application/pdf",

  // Videos
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime", // .mov
  "video/x-msvideo", // .avi
  "video/x-ms-wmv", // .wmv
  "video/mpeg", // .mpeg
  "video/3gpp", // .3gp
  "video/3gpp2", // .3g2
  "video/x-matroska", // .mkv
  "video/x-flv", // .flv
  "video/x-m4v",
  "video/*", // fallback for all videos
];

/**
 * Upload Middleware
 */
let upload = multer({
  storage: storage,
  fileFilter: (request, file: Express.Multer.File, callback: Function) => {
    console.log("file hereeee!!", file, file.mimetype);

    callback(null, true);
    if (MimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new BadRequestError([
          { field: "images", message: Messages.IMAGE_INVALID_TYPE },
        ])
      );
    }
  },
});
export let uploadAudio = multer({
  storage: audioStorage,
  fileFilter: (request, file: Express.Multer.File, callback: Function) => {
    callback(null, true);
  },
});

export default upload;

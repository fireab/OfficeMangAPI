import moment from 'moment';
import multer from 'multer';

/**
 * Storage
 */
let storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, "uploads");
    },
    filename: (request, file, callback) => {
        callback(null, getFilename(file));
    }
});

let audioStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, "audios");
    },
    filename: (request, file, callback) => {
        callback(null, getFilename(file));
    }
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
const MimeTypes = [ "image/png", "image/jpg", "image/jpeg", "image/*","application/pdf" ];

/**
 * Upload Middleware
 */
let upload = multer({
    storage: storage,
    fileFilter: (request, file: Express.Multer.File, callback: Function) => {
        // logger.info({
        //     operation: "Uploading Image",
        //     filename: file.filename,
        //     filesize: file.size,
        //     mimetype: file.mimetype, 
        // });
        // callback(new BadRequestError([
        //     { field: "images", message: Messages.IMAGE_INVALID_TYPE } 
        //  ]));
        callback(null, true);
        // if (MimeTypes.includes(file.mimetype)) {
        //     callback(null, true);
        // }
        // else {
        //     callback(new BadRequestError([
        //        { field: "images", message: Messages.IMAGE_INVALID_TYPE } 
        //     ]));
        // }
    }
});
export let uploadAudio = multer({
    storage: audioStorage,
    fileFilter: (request, file: Express.Multer.File, callback: Function) => {
        callback(null, true);
    
    }
});

export default upload;
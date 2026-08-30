import multer from "multer";

const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/png",
    "image/jpeg",
    "image/webp",
    "text/plain",
    "text/csv",
    "application/zip"
];

const fileFilter = (req, file, cb) => {

    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(null, true);
    }

    cb(new Error("Tipo de archivo no permitido"));

};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 25 * 1024 * 1024 // 25 MB
    }
});


const COURSE_CONTENT_MIME_TYPES = [
    ...ALLOWED_MIME_TYPES,
    "video/mp4",
    "video/webm",
    "video/quicktime"
];

const courseContentFileFilter = (req, file, cb) => {

    if (COURSE_CONTENT_MIME_TYPES.includes(file.mimetype)) {
        return cb(null, true);
    }

    cb(new Error("Tipo de archivo no permitido"));

};

export const courseContentUpload = multer({
    storage,
    fileFilter: courseContentFileFilter,
    limits: {
        fileSize: 1024 * 1024 * 1024 // 1 GB, para videos del curso
    }
});

export default upload;
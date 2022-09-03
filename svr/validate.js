import { body } from "express-validator";

// comment アップロード時のvalidate
const validateComment = [
    body("name").isLength({ max: 20 }).trim().escape().replace("\n", " "),
    body("comment").trim().escape(),
];

// blog アップロード時のvalidate
const validateUpload = [
    body("assetsDir").trim().escape(),
    body("title").trim().escape(),
    body("summary").trim().escape(),
    body("thumb").trim().escape(),
];


// cropper　アップロード時のvalidate
const validateCropperUpload = [
    body("width").trim().escape(),
];

export {
    validateComment, validateUpload,
    validateCropperUpload,
};
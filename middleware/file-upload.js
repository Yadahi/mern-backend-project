const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const MINE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    // The destination function is used to specify where the uploaded files should be stored.
    // It takes three arguments: req (the request object), file (the file being uploaded), and cb (the callback function).
    // The callback function is used to indicate whether the operation was successful or not.
    // In this case, we are specifying that the files should be stored in the "uploads/images" directory.
    destination: (req, file, cb) => {
      // The cb function is called with the first argument set to null to indicate success.
      // The second argument is the path where the file should be stored.
      cb(null, "uploads/images");
    },
    // The filename function is used to specify the name of the file when it is saved on disk.
    // It takes three arguments: req (the request object), file (the file being uploaded), and cb (the callback function).
    // The callback function is used to indicate whether the operation was successful or not.
    // In this case, we are generating a unique filename for each uploaded file by combining a UUID with the file extension.
    // The UUID is generated using the uuid/v4 module to ensure uniqueness.
    // The file extension is determined by the mimetype of the file being uploaded, which is mapped to the appropriate extension in the MINE_TYPE_MAP object.
    filename: (req, file, cb) => {
      // Extract the file extension from the mimetype.
      const ext = MINE_TYPE_MAP[file.mimetype];

      // Generate a UUID.
      const uuidValue = uuidv4();

      // Concatenate the UUID and the file extension to form the new filename.
      const newFilename = uuidValue + "." + ext;

      // Call the callback function with the new filename as the second argument.
      // The first argument is null to indicate success.
      cb(null, newFilename);
    },
  }),
  // The fileFilter function is used to filter out files that are not of the allowed types.
  // It takes three arguments: req (the request object), file (the file being uploaded), and cb (the callback function).
  // The callback function is used to indicate whether the operation was successful or not.
  // In this case, we are checking if the mimetype of the file being uploaded matches one of the allowed types.
  // If it does, the file is considered valid and the callback function is called with the first argument set to null to indicate success.
  // If it does not, an error is created with the message "Invalid mime type" and passed as the first argument to the callback function.
  fileFilter: (req, file, cb) => {
    // Check if the mimetype of the file being uploaded matches one of the allowed types.
    const isValid = !!MINE_TYPE_MAP[file.mimetype];

    // If the file is not valid, create an error with the message "Invalid mime type".
    let error = isValid ? null : new Error("Invalid mime type");

    // Call the callback function with the error and the validity status.
    // The first argument is the error object (null if the file is valid).
    // The second argument is a boolean indicating whether the file is valid or not.
    cb(error, isValid);
  },
});

module.exports = fileUpload;

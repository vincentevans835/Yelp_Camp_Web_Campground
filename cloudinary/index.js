const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Set up Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'YelpCamp', // Folder name in Cloudinary where the images will be stored
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

// Create an instance of Multer and pass in the Cloudinary storage engine
const upload = multer({ storage: storage });

module.exports = {
    cloudinary,
    upload
};

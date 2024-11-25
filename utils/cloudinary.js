const cloudinary = require('cloudinary').v2;
 const fs=require('fs')

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dcguwfqee',
    api_key: '844614238155326',
    api_secret: 'Y88dJSOM7inz4tKGliggm6CjzyU'
})

//Utility  function for uploading files


const uploadFile = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload file
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto', // Automatically detects the file type
            folder: 'wrocuTech',  // Specify folder in Cloudinary
        });

        // Remove local file after upload
        fs.unlinkSync(localFilePath);

        console.log('Upload successful:', uploadResult.secure_url);
        return uploadResult; // This URL works for the uploaded file
    } catch (error) {
        // Remove the local file if an error occurs
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error('Cloudinary upload failed:', error.message);
        return null;
    }
};


module.exports = { cloudinary, uploadFile }
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dcguwfqee',
    api_key: '844614238155326',
    api_secret: 'Y88dJSOM7inz4tKGliggm6CjzyU'
})

//Utility  function for uploading files


const uploadFile = async (filePath, wrocusTech) => {  // //wrocuTech is foldername
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {folder: wrocusTech });
        return uploadResult;

    } catch (error) {
        throw new Error(`Cloudinary upload failed:${error.message}`)

    }

}

module.exports = { cloudinary, uploadFile }
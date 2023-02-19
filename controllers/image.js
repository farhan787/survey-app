const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const sharp = require('sharp');

const getFilePath = ({
  directory,
  fileName,
  fileExtension,
  extendFileNameStr = '',
}) => {
  return `${directory}/${fileName}${extendFileNameStr}${fileExtension}`;
};

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
};

async function downloadImage({ url, directory, fileName, fileExtension }) {
  const filePath = getFilePath({ directory, fileName, fileExtension });
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filePath))
      .on('error', reject)
      .once('close', () => resolve(filePath));
  });
}

const resizeImage = ({ directory, fileName, fileExtension, height, width }) => {
  const filePath = getFilePath({ directory, fileName, fileExtension });
  const resizedImagePath = getFilePath({
    directory,
    fileName,
    fileExtension,
    extendFileNameStr: '_thumbnail',
  });

  return new Promise((resolve, reject) => {
    sharp(filePath)
      .resize(height, width)
      .toFile(resizedImagePath, function (err) {
        if (err) {
          reject(err);
        }
        resolve({ filePath, resizedImagePath });
      });
  });
};

const imageThumbnail = async ({ imageUrl: url, height, width }) => {
  const directory = path.resolve(__dirname, '../image_temp');
  const fileName = `${uuidv4()}`;
  const fileExtension = '.png';

  await downloadImage({
    url,
    directory,
    fileName,
    fileExtension,
  });

  const { resizedImagePath, filePath } = await resizeImage({
    directory,
    fileName,
    fileExtension,
    height,
    width,
  });

  return { downloadedImagePath: filePath, thumbnailPath: resizedImagePath };
};

module.exports = { imageThumbnail, deleteFile };

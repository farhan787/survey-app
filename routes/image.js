const express = require('express');
const router = express.Router();
const fs = require('fs');

const { deleteFile, imageThumbnail } = require('../controllers/image');

router.post('/', async (req, res) => {
  const { imageUrl, height, width } = req.body;

  const { thumbnailPath, downloadedImagePath } = await imageThumbnail({
    imageUrl,
    height,
    width,
  });

  res.sendFile(thumbnailPath, () => {
    deleteFile(downloadedImagePath);
    deleteFile(thumbnailPath);
  });
});

module.exports = router;

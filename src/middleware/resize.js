const sharp = require('sharp');

// Image resize
const resize = async (image) => {
  const resizedImage = await sharp(image).resize(300, 300).png().toBuffer();

  return resizedImage;
};

module.exports = resize;
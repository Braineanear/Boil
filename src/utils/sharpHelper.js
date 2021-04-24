import sharp from 'sharp';

export const resize = async (buffer, width, hight) => {
  await sharp(buffer)
    .resize({
      fit: sharp.fit.contain,
      width,
      hight
    })
    .toBuffer();
};

export const convert = async (buffer) =>
  await sharp(buffer).webp({ lossless: true }).toBuffer();

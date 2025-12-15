const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3 } = require("../utils/s3.js");
const { v4: uuidv4 } = require("uuid");

exports.uploadToS3 = async (req) => {
  try {
    const files = req.files;
    const uploadPromises = files.map((file) => {
      const key = `buyer-seller/deliverable/${uuidv4()}-${Date.now()}-${
        file.originalname
      }`;

      return s3
        .send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
        )
        .then(
          () => `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`
        );
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    if (!uploadedFiles) throw new Error("Failed to upload");

    return uploadedFiles;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

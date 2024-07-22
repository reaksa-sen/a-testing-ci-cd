import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import configs from "../config";

const { region, accessKeyId, secretAccessKey } = configs;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error('AWS S3 configuration error: missing region or credentials');
}

export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});


export const uploadFile = async (file: Express.Multer.File): Promise<string> => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);
  return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${params.Key}`;
};



// upload multi
// const uploadPromises = files.map(async (file) => {
//   const params = {
//     Bucket: bucketName,
//     Key: `${Date.now()}-${file.originalname}`,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };
//   s3.send(new PutObjectCommand(params));
//   // Save file metadata to database
//   const fileMetadata = {
//     url: `https://${bucketName}.s3.amazonaws.com/${params.Key}`, // Assuming URL format
//   };
//   await userRepository.saveFile(fileMetadata);
// }
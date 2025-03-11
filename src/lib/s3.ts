import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import { stringify } from 'csv-stringify/sync';

const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  }
});

export async function uploadToS3(file:any, fileName:string) {
    const csvData = stringify(file, { header: true });
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body:csvData,
    ContentType: "text/csv", // Set appropriate MIME type
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);
  
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}

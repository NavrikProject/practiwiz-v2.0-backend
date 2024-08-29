import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { BlockBlobClient } from "@azure/storage-blob";
import intoStream from "into-stream";
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail(msg) {
  const successEmail = "True";
  const errorEmail = "False";
  try {
    await sgMail.send(msg);
    console.log("Email sent");
    return successEmail;
  } catch (error) {
    console.error(error.message);
    console.log("Email not sent");
    return errorEmail;
  }
}

export function uploadMentorPhotoToAzure(imageData, blobName) {
  const blobService = new BlockBlobClient(
    process.env.AZURE_STORAGE_CONNECTION_STRING,
    "practiwizcontainer/mentorprofilepictures",
    blobName
  );
  const stream = intoStream(imageData.image.data);
  const streamLength = imageData.image.data.length;
  blobService
    .uploadStream(stream, streamLength)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      return res.send({
        error: "There was an error uploading",
      });
    });
}

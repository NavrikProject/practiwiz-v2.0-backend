import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { BlockBlobClient } from "@azure/storage-blob";
import intoStream from "into-stream";
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export function sendEmail(msg) {
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      return True;
    })
    .catch((error) => {
      console.error(error.message);
      return False;
    });
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

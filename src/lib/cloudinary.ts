import { UploadApiResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true,
});

export default cloudinary;

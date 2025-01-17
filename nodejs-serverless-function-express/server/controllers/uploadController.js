import { v2 as cloudinary } from "cloudinary";

const uploadFile = (req, res) => {
  cloudinary.uploader.upload(req.file.path, (err, result) => {
    try {
      console.log("File uploaded successfully", result.url);
      if (req.file === undefined) {
        return res.status(400).send("Please upload a file!");
      }
      return res.status(200).send({
        message: "File uploaded successfully",
        url: req.file.path,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  });
};

export { uploadFile };

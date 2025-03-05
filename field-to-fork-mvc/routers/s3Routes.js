const { Router } = require("express");
const AWS = require("aws-sdk");
require("dotenv").config();
const cors = require("cors");  

const s3Router = Router();

s3Router.use(cors()); 

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

s3Router.get("/get-presigned-url", async (req, res) => {
    try {
        const fileName = req.query.fileName;
        const fileType = req.query.fileType;

        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `uploads/${Date.now()}-${fileName}`,
            Expires: 60,
            ContentType: fileType,
        };

        const signedUrl = await s3.getSignedUrlPromise("putObject", params);

        res.json({ 
            url: signedUrl, 
            imageUrl: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${params.Key}` 
        });
    } catch (error) {
        console.error("Error generating pre-signed URL", error);
        res.status(500).json({ error: "Failed to generate pre-signed URL" });
    }
});

module.exports = s3Router;

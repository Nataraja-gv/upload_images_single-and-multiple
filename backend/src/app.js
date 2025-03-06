const express = require("express");
const connectDB = require("./config/database")
const cors = require('cors')
const multer = require("multer")
const { Image, MultiImage } = require("./models/images")

const app = express();
app.use(express.json());
app.use(cors())
app.use("/uploads", express.static("src/uploads"));




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/uploads")
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + '-' + file.originalname;
        cb(null, filename);
    }
})

const upload = multer({ storage: storage })



app.post("/upload_image", upload.single("file"), async (req, res) => {

    try {
        if (!req.file) {
            throw new Error("image file not found");
        }

        const images = new Image({
            filename: req.file.filename,
            path: `uploads/${req.file.filename}`,
            contentType: req.file.mimetype,
        })

        await images.save();
        res.json({ message: "File uploaded successfully!", imageId: images._id });

    }
    catch (error) {
        console.log(error.message || error)
    }
})


app.post("/multi/upload_image", upload.array("files", 10), async (req, res) => {
    if (!req.files || req.files.length === 0) { // Fix: Check req.files, not req.file
        return res.status(400).json({ error: "No files uploaded" });
    }
    try {


        const fileData = req.files.map(file => ({
            filename: file.filename,
            path: `uploads/${file.filename}`,
            contentType: file.mimetype
        }));

        // Create a new document containing multiple images
        const newImages = new MultiImage({ images: fileData });
        await newImages.save();


        res.json({ message: "File uploaded successfully!", imageId: newImages._id });

    }
    catch (error) {
        console.log(error.message || error)
    }
});


app.get("/multi/all", async(req, res) => {
    try {
        const images = await MultiImage.find();

        res.json({ data: images })

    }
    catch (error) {
        console.log(error)
    }
})



connectDB().then(
    () => {
        console.log("Data Base connected ")
        app.listen(7777, () => {
            console.log("server connected sucessfully  port 7777")
        })
    }
).catch(() => {
    console.log("something went wrong")
})


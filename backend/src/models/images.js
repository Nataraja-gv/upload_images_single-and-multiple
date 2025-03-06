const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    path: { type: String, required: true },
    contentType: { type: String, required: true }
});

const imageMultiSchema = new mongoose.Schema({
    images: [
        {
            filename: { type: String, required: true },
            path: { type: String, required: true },
            contentType: { type: String, required: true }
        }
    ]
});


const Image = mongoose.model("Image", imageSchema);
const MultiImage = mongoose.model("MultiImage", imageMultiSchema);


module.exports = { Image, MultiImage };

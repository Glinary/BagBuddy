const mongoose = require("mongoose");

const itemsSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    itemGalleryID: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Items", itemsSchema);
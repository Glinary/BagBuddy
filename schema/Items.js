const mongoose = require("mongoose");

const itemsSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  itemName: {
    type: String,
    required: true,
  },
  itemWeight: {
    type: Number,
    required: false,
    default: 0,
  },
  category: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Items", itemsSchema);

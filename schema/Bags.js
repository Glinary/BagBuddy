const mongoose = require("mongoose");

const bagsSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  bagCategory: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
  bagName: {
    type: String,
    required: true,
  },
  bagWeight: {
    type: Number,
    required: false,
    default: 0,
  },
  bagColor: {
    type: String,
    required: true,
    default: "black",
  },
  packingStatus: {
    type: String,
    required: true,
    default: "Not yet started",
  },
  dateUsage: {
    type: Date,
    required: false,
  },
  bagCollabs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
  ],
  items: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      quantity: {
        type: Number,
        required: false,
        default: 1,
      },
    },
  ],
});

module.exports = mongoose.model("Bags", bagsSchema);

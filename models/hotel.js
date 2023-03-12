const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const hotelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  photos: [
    {
      type: String,
      required: true,
    },
  ],
  desc: {
    type: String,
    required: true,
  },
  cheapestPrice: {
    type: Number,
    required: false,
  },
  rating: {
    type: Number,
    required: true,
  },
  featured: {
    type: String,
  },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
});

hotelSchema.methods.totalRooms = module.exports = mongoose.model(
  "Hotel",
  hotelSchema
);

// "rooms":["6311b3944a642f01423490df
// ", "6311c0a8f2fce6ea18172fc3
// "]

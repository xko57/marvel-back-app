const { stringify } = require("crypto-js/enc-base64");
const mongoose = require("mongoose");

const Favori = mongoose.model("Favori", {
  card_id: String,
  card_type: String,
  card_name: String,
  card_thumbnail: {
    path: String,
    extension: String,
  },
  card_description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Favori;

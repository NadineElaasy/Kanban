const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

const ListSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cards: [CardSchema],
  },
  { _id: false }
);
const BoardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  lists: [ListSchema],
});

const Board = mongoose.model("boards", BoardSchema);
module.exports = Board;

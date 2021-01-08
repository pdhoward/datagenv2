const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  _id: Number,
  type: String,   // set to Message  
  messageid: String,
  brandid: String,
  tagid: String,
  content: Object,   // see machine/messages
  start: Date,
  stop: Date,
  timestamp: Date,
  updatedOn: Date
}, {collection: 'messages'});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;

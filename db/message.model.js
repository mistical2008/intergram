const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MessageSchema = new Schema({
  "user": {type: String, required: true},
  "message": {type: String, required: true},
},
{
  timestamp: true
})

// Export the model
module.exports = mongoose.model('Message', MessageSchema);
//

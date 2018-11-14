const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MessageSchema = new Schema({
  "user": {type: String, required: true},
  "message": {type: String, required: true},
},
{
  timestamps: { createdAt: 'created_at' }
})

// Export the model
module.exports = mongoose.model('Message', MessageSchema);
//

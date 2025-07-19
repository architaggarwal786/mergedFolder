  const mongoose = require('mongoose');
 
 const clothesSchema = new mongoose.Schema({
      uuid: {
    type: String,
    unique: true,
  },
   season: String,
   gender: String,
   type: String,
   subType: String,
   color: String, // ✅ New field to store predicted color
   style: String, 
   images: [
     {
       filename: String,
       path: String
     }
   ],
   geminiOutput: String, // ✅ Raw Gemini response
   uploadedBy: {
     type: String,
     enum: ['user', 'company'],
     default: 'user' // ✅ Default to 'user' uploads
   },
   createdAt: {
     type: Date,
     default: Date.now
   }
 });
 
 module.exports = mongoose.model('Clothes', clothesSchema);
 
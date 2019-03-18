const mongoose = require("mongoose");

mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

const nameSchema = new mongoose.Schema({
    opening_hours: [String],
    address: String,
    phone_number: String,
    location: {
      lat : Number,
      lng : Number
    },
    icon: String,
    name: String,
    rating: Number,
    google_maps_url: String,
    website: String,
    photo: String,
    id:{ type: Number, index: true, unique: true, required: true }
});
  
module.exports = mongoose.model("restaurants", nameSchema);
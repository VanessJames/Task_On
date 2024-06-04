const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


// Check database connected or not
const mongoURI = process.env.MONGO_URI + '?tls=true';

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// collection part
const collection = new mongoose.model("users", Loginschema);

module.exports = collection;

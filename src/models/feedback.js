const mongoose = require('mongoose');
const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    phone:{
        type: String,
        required: true,
    },
    comment:{
        type: String,
    }
});

const Feedback = new mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
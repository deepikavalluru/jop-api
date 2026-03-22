const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required : true,
        toLowerCase: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        toLowerCase: true,
        trim: true
    },
    location: {
        type: String,
        default: "Remote",
        toLowerCase: true,
        trim: true
    },
    applyLink: {
        type: String,
        required: true,
        unique: true
    },
    skills: [
        {
            type: String
        }
    ],
    source: {
        type: String,
        required: true
    },
}, {timestamps: true});

jobSchema.index({applyLink : 1}, {unique: true});
module.exports = mongoose.model("Job", jobSchema);
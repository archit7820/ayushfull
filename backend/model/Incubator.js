const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incubatorSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    programName: { type: String, required: true },
    duration: { type: String, required: true },
    startupsSupported: { type: String, required: true }, 
});

module.exports = mongoose.model('Incubator', incubatorSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const acceleratorSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    programName: { type: String, required: true },
    duration: { type: String, required: true },
    startupsSupported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Startup' }]
});

module.exports = mongoose.model('Accelerator', acceleratorSchema);

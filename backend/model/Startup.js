const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const startupSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },  // Startup Name
    founder: { type: String, required: true }, // Founder
    foundingDate: { type: Date, required: true }, // Founding Date
    domain: { type: String, required: true }, // Domain
    industry: { type: String, required: true }, // Industry
    margin: { type: Number, required: true }, // Margin
    revenue: { type: Number, required: true }, // Revenue
    employees: { type: Number, required: true }, // Employees
    marketSize: { type: Number, required: true }, // Market size
    ownerName: { type: String, required: true },
    ceo: { type: String, required: true },
    cfo: { type: String, required: true },
    cmo: { type: String, required: true },
    cto: { type: String, required: true },
    type: { type: String, required: true }
});

module.exports = mongoose.model('Startup', startupSchema);

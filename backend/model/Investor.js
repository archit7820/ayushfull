const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const investorSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    investmentAmount: { type: Number, required: true },
    investmentStage: { type: String, required: true },
    portfolio: { type: String, required: true },
    preferredIndustries: [{ type: String }]
});

module.exports = mongoose.model('Investor', investorSchema);

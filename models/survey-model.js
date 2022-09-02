const { Schema, model } = require('mongoose');

const SurveySchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'Owner' },
    dates: { type: Object, required: true },
    expiresIn: { type: String, required: true },
    link: { type: String, required: true },
});

module.exports = model('Survey', SurveySchema);

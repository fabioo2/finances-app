const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    client: { type: String, required: true },
    amount: { type: Number, required: true },
    paid: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

jobSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject.__id;
        delete returnedObject.__v;
    },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;

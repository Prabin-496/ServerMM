// Importing
import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['contact', 'booking'], required: true },
    details: {
        title: String,
        message: String,
        packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
        date: Date
    },
    createdAt: { type: Date, default: Date.now }
});


export default mongoose.model('Request', requestSchema);
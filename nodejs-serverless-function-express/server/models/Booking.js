import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  packageName: String,
  bookingDate: Date,
  customerName: String,
  customerEmail: String,
  contactNumber: String,
  numberOfPeople: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);
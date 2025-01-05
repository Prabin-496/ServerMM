import mongoose from 'mongoose';

const contactSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  messageTitle: { type: String, required: true },
  message: { type: String, required: true },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema);
export default ContactSubmission;
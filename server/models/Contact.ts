import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  projectType: { type: String, required: true },
  budget: { type: String, required: true },
  message: { type: String, required: true },
  replied: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Contact = mongoose.model('Contact', contactSchema);

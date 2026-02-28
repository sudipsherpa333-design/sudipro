import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  heroTitle: { type: String, default: 'MERN + AI Developer' },
  heroSubtitle: { type: String, default: 'Building AI-powered platforms with 85% Job Match Accuracy.' },
  usersServed: { type: String, default: '500+' },
  whatsapp: { type: String, default: '+977-9800000000' },
  telegram: { type: String, default: 'sudipsherpa' },
  linkedin: { type: String, default: 'sudipsherpa' },
  github: { type: String, default: 'sudipsherpa' },
  email: { type: String, default: 'admin@sudip.dev' },
  totalVisitors: { type: Number, default: 0 },
});

export const Settings = mongoose.model('Settings', settingsSchema);

import mongoose from 'mongoose';

const techStackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Frontend', 'Backend', 'AI', 'Tools'], required: true },
  proficiency: { type: Number, min: 0, max: 100, default: 80 },
  order: { type: Number, default: 0 },
});

export const TechStack = mongoose.model('TechStack', techStackSchema);

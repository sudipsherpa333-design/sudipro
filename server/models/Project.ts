import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  metrics: { type: String, required: true },
  tech: [{ type: String }],
  demoUrl: { type: String },
  githubUrl: { type: String },
  featured: { type: Boolean, default: false },
  category: { type: String, enum: ['AI', 'MERN', 'Freelance', 'Other'], default: 'MERN' },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Project = mongoose.model('Project', projectSchema);

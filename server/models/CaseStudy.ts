import mongoose from 'mongoose';

const caseStudySchema = new mongoose.Schema({
  title: { type: String, required: true },
  clientName: { type: String, required: true },
  metrics: [{ type: String }],
  description: { type: String, required: true },
  roi: { type: String, required: true },
  imageUrl: { type: String },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);

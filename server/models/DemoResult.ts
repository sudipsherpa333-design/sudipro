import mongoose from 'mongoose';

const demoResultSchema = new mongoose.Schema({
  demoType: { type: String, enum: ['ResumeAnalyzer', 'JobSearch', 'ApiTester'], required: true },
  inputData: { type: mongoose.Schema.Types.Mixed },
  resultData: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

export const DemoResult = mongoose.model('DemoResult', demoResultSchema);

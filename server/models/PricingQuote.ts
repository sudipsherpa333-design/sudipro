import mongoose from 'mongoose';

const pricingQuoteSchema = new mongoose.Schema({
  projectType: { type: String, required: true },
  features: [{ type: String }],
  totalPrice: { type: Number, required: true },
  timelineDays: { type: Number, required: true },
  contacted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const PricingQuote = mongoose.model('PricingQuote', pricingQuoteSchema);

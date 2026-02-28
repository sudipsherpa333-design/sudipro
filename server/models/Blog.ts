import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String },
  content: { type: String, required: true }, // Markdown or HTML
  category: { type: String, enum: ['MERN', 'AI', 'Freelancing', 'Nepal Tech'], required: true },
  tags: [{ type: String }],
  featuredImage: { type: String },
  published: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Blog = mongoose.model('Blog', blogSchema);

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { Project } from '../models/Project';
import { TechStack } from '../models/TechStack';
import { Blog } from '../models/Blog';
import { Contact } from '../models/Contact';
import { Settings } from '../models/Settings';
import { DemoResult } from '../models/DemoResult';
import { PricingQuote } from '../models/PricingQuote';
import { CaseStudy } from '../models/CaseStudy';
import { adminAuth } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'SudipRo@2026Portfolio_SecretKey_123';

// Fixed credentials for demo
const ADMIN_USER = 'sudip98@gmail.com';
const ADMIN_PASS = 'sudip9813@#$';

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.json({ success: true, message: 'Logged in successfully', token });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

router.post('/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Logged out' });
});

router.get('/check', adminAuth, (req, res) => {
  res.json({ success: true, user: (req as any).admin });
});

// Protect all routes below
router.use(adminAuth);

// Dashboard Stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const totalDemos = await DemoResult.countDocuments();
    const totalQuotes = await PricingQuote.countDocuments();
    const settings = await Settings.findOne() || new Settings();
    
    res.json({
      totalVisitors: settings.totalVisitors,
      totalProjects,
      totalBlogs,
      totalContacts,
      totalDemos,
      totalQuotes
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// Case Studies CRUD
router.get('/case-studies', async (req, res) => {
  const studies = await CaseStudy.find().sort({ createdAt: -1 });
  res.json(studies);
});
router.post('/case-studies', async (req, res) => {
  const study = new CaseStudy(req.body);
  await study.save();
  res.json(study);
});
router.put('/case-studies/:id', async (req, res) => {
  const study = await CaseStudy.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(study);
});
router.delete('/case-studies/:id', async (req, res) => {
  await CaseStudy.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Demo Results
router.get('/demo-results', async (req, res) => {
  const results = await DemoResult.find().sort({ createdAt: -1 }).limit(50);
  res.json(results);
});

// Pricing Quotes
router.get('/pricing-quotes', async (req, res) => {
  const quotes = await PricingQuote.find().sort({ createdAt: -1 }).limit(50);
  res.json(quotes);
});

// Projects CRUD
router.get('/projects', async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});
router.post('/projects', async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.json(project);
});
router.put('/projects/:id', async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(project);
});
router.delete('/projects/:id', async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Tech Stack CRUD
router.get('/techstack', async (req, res) => {
  const tech = await TechStack.find().sort({ order: 1 });
  res.json(tech);
});
router.post('/techstack', async (req, res) => {
  const tech = new TechStack(req.body);
  await tech.save();
  res.json(tech);
});
router.put('/techstack/:id', async (req, res) => {
  const tech = await TechStack.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(tech);
});
router.delete('/techstack/:id', async (req, res) => {
  await TechStack.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Blogs CRUD
router.get('/blogs', async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});
router.post('/blogs', async (req, res) => {
  const blog = new Blog(req.body);
  await blog.save();
  res.json(blog);
});
router.put('/blogs/:id', async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(blog);
});
router.delete('/blogs/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Contacts
router.get('/contacts', async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
});
router.put('/contacts/:id', async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(contact);
});

// Settings
router.get('/settings', async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
    await settings.save();
  }
  res.json(settings);
});
router.put('/settings', async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = new Settings();
  Object.assign(settings, req.body);
  await settings.save();
  res.json(settings);
});

export default router;

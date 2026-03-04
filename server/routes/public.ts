import { Router } from 'express';
import { GoogleGenAI, Type } from "@google/genai";
import nodemailer from 'nodemailer';
import { Project } from '../models/Project';
import { TechStack } from '../models/TechStack';
import { Blog } from '../models/Blog';
import { Contact } from '../models/Contact';
import { Settings } from '../models/Settings';
import { DemoResult } from '../models/DemoResult';
import { PricingQuote } from '../models/PricingQuote';
import { CaseStudy } from '../models/CaseStudy';

const router = Router();

// Analytics middleware to track visitors
router.use(async (req, res, next) => {
  if (req.path === '/settings') {
    try {
      await Settings.findOneAndUpdate({}, { $inc: { totalVisitors: 1 } }, { upsert: true });
    } catch (e) {}
  }
  next();
});

router.get('/settings', async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = new Settings();
  res.json(settings);
});

router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Failed to fetch projects" });
  }
});

router.post('/projects/:id/click', async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
  res.json({ success: true });
});

router.get('/techstack', async (req, res) => {
  try {
    const tech = await TechStack.find().sort({ order: 1 });
    res.json(tech);
  } catch (error) {
    console.error("Error fetching techstack:", error);
    res.status(500).json({ success: false, message: "Failed to fetch techstack" });
  }
});

router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch blogs" });
  }
});

router.get('/blogs/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, published: true },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ success: false, message: "Failed to fetch blog" });
  }
});
router.post('/contact', async (req, res) => {
  try {
    // Validate required fields
    const { name, email, message, whatsapp, projectType, budget } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email, and message are required." });
    }

    // Save to DB
    let contactRecord;
    try {
      contactRecord = new Contact({ name, email, message, whatsapp, projectType, budget });
      await contactRecord.save();
    } catch (dbErr) {
      console.warn("Failed to save contact:", dbErr);
      contactRecord = { name, email, message, whatsapp, projectType, budget }; // fallback
    }

    // Send Email
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
          to: process.env.EMAIL_TO || process.env.SMTP_USER,
          subject: `New Contact from ${contactRecord.name}`,
          text: `Name: ${contactRecord.name}\nEmail: ${contactRecord.email}\nWhatsApp: ${contactRecord.whatsapp || 'N/A'}\nProject Type: ${contactRecord.projectType}\nBudget: ${contactRecord.budget}\n\nMessage:\n${contactRecord.message}`,
        });
        console.log("✅ Email sent successfully.");
      } catch (emailErr) {
        console.error("❌ Email sending failed:", emailErr);
      }
    } else {
      console.warn("⚠️ SMTP credentials missing. Skipping email.");
    }

    // Always respond to frontend
    return res.json({ success: true, message: "Thanks! I'll reply in 2 hours 🚀" });
  } catch (err) {
    console.error("🔥 /contact Error:", err);
    return res.status(500).json({ success: false, message: "Failed to send message. Try again later." });
  }
});

// Demo Playground APIs
router.post('/demo/resume-analyze', async (req, res) => {
  const { fileName, fileData, mimeType } = req.body;
  
  if (!fileData) {
    return res.status(400).json({ error: "Missing file data" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || "application/pdf",
              data: fileData,
            },
          },
          {
            text: "Analyze this resume for ATS compatibility. Provide a score out of 100, an ATS pass rate percentage, and 3-5 specific feedback points for improvement.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "The ATS score out of 100",
            },
            atsPassRate: {
              type: Type.STRING,
              description: "The ATS pass rate percentage (e.g., '92%')",
            },
            feedback: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "3-5 specific feedback points for improvement",
            },
          },
          required: ["score", "atsPassRate", "feedback"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");

    try {
      const demo = new DemoResult({
        demoType: 'ResumeAnalyzer',
        inputData: { fileName },
        resultData: result
      });
      await demo.save();
    } catch (e) {
      console.error("Failed to save demo result", e);
    }

    res.json(result);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

// Pricing Calculator API
router.post('/pricing/calculate', async (req, res) => {
  const { projectType, features } = req.body;
  let basePrice = 20000;
  let days = 7;

  if (projectType === 'SaaS') { basePrice = 50000; days = 20; }
  else if (projectType === 'E-commerce') { basePrice = 40000; days = 15; }

  let addonsPrice = 0;
  if (features.includes('MERN Fullstack')) { addonsPrice += 25000; days += 5; }
  if (features.includes('AI Matching')) { addonsPrice += 15000; days += 3; }
  if (features.includes('Admin Dashboard')) { addonsPrice += 12000; days += 4; }
  if (features.includes('PWA Mobile')) { addonsPrice += 8000; days += 2; }
  if (features.includes('Kathmandu Geo')) { addonsPrice += 5000; days += 1; }

  const totalPrice = basePrice + addonsPrice;

  try {
    const quote = new PricingQuote({
      projectType,
      features,
      totalPrice,
      timelineDays: days
    });
    await quote.save();
  } catch (e) {}

  res.json({ totalPrice, timelineDays: days });
});

// Case Studies API
router.get('/case-studies', async (req, res) => {
  try {
    const studies = await CaseStudy.find().sort({ createdAt: -1 });
    res.json(studies);
  } catch (error) {
    console.error("Error fetching case studies:", error);
    res.status(500).json({ success: false, message: "Failed to fetch case studies" });
  }
});

export default router;

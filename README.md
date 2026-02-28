# SudipRo -  MERN Portfolio 🚀

A high-converting, production-ready SaaS portfolio built with the MERN stack (MongoDB, Express, React, Node.js) and AI integrations. Designed specifically to convert visitors into high-paying clients through interactive core revenue systems.

## 🔥 Top 3 Core Revenue Systems
This portfolio goes beyond a static showcase by integrating three powerful conversion engines:

1. **Live Demo Playground (`/demo`)**: Allows recruiters and clients to test production skills instantly (e.g., AI Resume Analyzer).
2. **Dynamic Pricing Calculator (`/pricing`)**: Provides transparent, interactive project quotes with WhatsApp integration.
3. **Case Studies & ROI Dashboard (`/case-studies`)**: Builds trust with real metrics, ROI figures, and client success stories.

## 🛠️ Features
- **Full Admin Control Panel**: Manage Projects, Tech Stack, Blogs, Contacts, Settings, Demo Results, Pricing Quotes, and Case Studies from a secure dashboard.
- **Glassmorphism UI & 60fps Animations**: Built with Tailwind CSS, Framer Motion, and Lenis smooth scrolling.
- **Three.js Particle Background**: A stunning, interactive 3D starfield hero section.
- **Rate Limiting & Security**: Built-in Express rate limiting, Helmet, and CORS protection.
- **Graceful Fallbacks**: The app runs in a mock-data fallback mode if the MongoDB connection fails.

## 🚀 Quick Start & `.env` Setup Tutorial

Follow these steps to run the project locally or deploy it to production.

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas Account (or local MongoDB server)

### 2. Clone and Install
```bash
git clone <your-repo-url>
cd portfolio-saas-v2
npm install
```

### 3. Environment Variables Setup (`.env`)
Create a `.env` file in the root directory of your project. You can copy the provided `.env.example`:

```bash
cp .env.example .env
```

Open the `.env` file and configure the following variables:

```env
# 1. MongoDB Connection String (Required)
# Replace <db_username> and <db_password> with your MongoDB Atlas credentials.
# Note: If your password contains special characters like '@', '#', or '$', you must URL-encode them (e.g., '@' becomes '%40', '#' becomes '%23', '$' becomes '%24').
MONGODB_URI=mongodb+srv://sudipro:sudipro9813%40%23%24@cluster0.h5be6xs.mongodb.net/?appName=Cluster0

# 2. JWT Secret (Required)
# Used for signing admin authentication tokens. Change this to a long, random string in production.
JWT_SECRET=SudipRo@2026Portfolio_SecretKey_123

# 3. Port (Optional)
# The port your server will run on. Defaults to 3000.
PORT=3000
```

### 4. Run the Development Server
```bash
npm run dev
```
The application will start on `http://localhost:3000`.

## 🔐 Admin Access

To access the admin dashboard, navigate to `http://localhost:3000/admin/login`.

**Default Credentials:**
- **Email:** `sudip98@gmail.com`
- **Password:** `sudip9813@#$`

*(Note: You can change these credentials in `server/routes/admin.ts` before deploying to production).*

## 🏗️ Architecture
```text
portfolio-saas-v2/
├── src/
│   ├── admin/              # Secure Admin Dashboard (React)
│   ├── components/         # Reusable UI Components
│   ├── pages/              # Core Revenue Systems (Demo, Pricing, Case Studies)
│   └── App.tsx             # Main React Router setup
├── server/
│   ├── models/             # Mongoose Schemas (Project, Blog, CaseStudy, etc.)
│   ├── routes/             # Express API Routes (Public & Admin)
│   └── middleware/         # JWT Auth Middleware
└── server.ts               # Express Server Entry Point
```

## 📈 Deployment
This project is optimized for deployment on platforms like Render, Vercel, or Railway.
1. Build the project: `npm run build`
2. Start the production server: `npm start` (which runs `node server.ts`)
3. Ensure you set the `MONGODB_URI` and `JWT_SECRET` environment variables in your hosting provider's dashboard.

---
*Designed and built by [SudipRo](https://sudipro.dev)*

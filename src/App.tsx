import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { motion, useScroll, useSpring } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import TechStack from "./components/TechStack";
import About from "./components/About";
import Contact from "./components/Contact";
import Navbar from "./components/Navbar";
import AdminApp from "./admin/AdminApp";
import DemoPlayground from "./pages/Demo";
import Pricing from "./pages/Pricing";
import CaseStudies from "./pages/CaseStudies";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";

function PublicLayout() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-dark-bg min-h-screen text-white selection:bg-accent selection:text-dark-bg">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50 shadow-[0_0_10px_#00d4ff]"
        style={{ scaleX }}
      />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Projects />
              <TechStack />
              <About />
              <Contact />
            </>
          } />
          <Route path="/demo" element={<DemoPlayground />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/blog" element={<Blogs />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Phone,
  MapPin,
  User,
  Mail,
  Briefcase,
  DollarSign,
  FileText,
  ArrowRight,
  Linkedin
} from "lucide-react";

export default function Contact() {
  const contactInfo = [
    { icon: Mail, label: "Email", value: "sudipsherpa999@gmail.com", href: "mailto:sudipsherpa999@gmail.com" },
    { icon: Phone, label: "WhatsApp", value: "+977 9813319831", href: "https://wa.me/9779813319831" },
    { icon: Linkedin, label: "LinkedIn", value: "Connect on LinkedIn", href: "https://linkedin.com/in/yourusername" },
    { icon: MapPin, label: "Location", value: "Kathmandu, Nepal", href: null }
  ];

  return (
    <section id="contact" className="py-32 px-4 bg-dark-bg relative overflow-hidden min-h-screen flex items-center">
      {/* Advanced Background Effects */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center mb-6 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm font-mono tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-accent mr-3 animate-pulse"></span>
              Available for work
            </div>

            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-tight">
              Let's build <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">together.</span>
            </h2>

            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
              Ready to transform your ideas into a high-performance MERN application? 
              Reach out through any of these channels and let's discuss your vision.
            </p>
          </motion.div>

          {/* Right Column: Contact Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Decorative glow inside the card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="space-y-6 relative z-10">
                {contactInfo.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    whileHover={{ x: 10 }}
                    className="group"
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-6 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-accent group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-500 shadow-lg">
                          <item.icon size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm text-gray-500 font-mono mb-1 uppercase tracking-wider">
                            {item.label}
                          </h4>
                          <p className="text-xl font-medium text-white group-hover:text-accent transition-colors">
                            {item.value}
                          </p>
                        </div>
                        <ArrowRight size={20} className="text-gray-500 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                      </a>
                    ) : (
                      <div className="flex items-center space-x-6 p-4 rounded-2xl">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-accent group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-500 shadow-lg">
                          <item.icon size={24} />
                        </div>
                        <div>
                          <h4 className="text-sm text-gray-500 font-mono mb-1 uppercase tracking-wider">
                            {item.label}
                          </h4>
                          <p className="text-xl font-medium text-white">{item.value}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Availability Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="mt-8 pt-6 border-t border-white/10 text-center"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                    </span>
                    <span className="text-sm text-gray-400">Open to new opportunities</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

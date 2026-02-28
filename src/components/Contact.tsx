import { useState } from "react";
import { motion } from "framer-motion";
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
  FileText
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "Fullstack",
    budget: "< $1k",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setResponseMsg(data.message);
        setFormData({
          name: "",
          email: "",
          projectType: "Fullstack",
          budget: "< $1k",
          message: "",
        });
      } else {
        setStatus("error");
        setResponseMsg(data.message || "Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setResponseMsg("Failed to send message. Please try again.");
    }
  };

  return (
    <section id="contact" className="py-32 px-4 bg-dark-surface relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Let's <span className="text-accent">Connect</span>
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-md">
              Ready to build your next AI-powered MERN application? Let's
              discuss your project requirements.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-center space-x-4 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-300">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 font-mono mb-1 uppercase tracking-wider">
                    Email
                  </h4>
                  <a
                    href="mailto:sudipsherpa999@gmail.com"
                    className="text-lg font-medium hover:text-accent transition-colors"
                  >
                    sudipsherpa999@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-300">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 font-mono mb-1 uppercase tracking-wider">
                    WhatsApp / Telegram
                  </h4>
                  <a
                    href="#"
                    className="text-lg font-medium hover:text-accent transition-colors"
                  >
                    +977 9800000000
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-300">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 font-mono mb-1 uppercase tracking-wider">
                    Location
                  </h4>
                  <p className="text-lg font-medium">Kathmandu, Nepal</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 font-mono mb-1 uppercase tracking-wider">
                    LinkedIn
                  </h4>
                  <a
                    href="https://www.linkedin.com/feed/?shareActive=true&url=http%3A%2F%2Flocalhost%3A5174%2Fresume%2Fshare%2Fresume_1764766477706_5j5m4aoke&shareUrl=http%3A%2F%2Flocalhost%3A5174%2Fresume%2Fshare%2Fresume_1764766477706_5j5m4aoke&linkOrigin=LI_BADGE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium hover:text-accent transition-colors"
                  >
                    Connect with me
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-dark-bg border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-600"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-dark-bg border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-600"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="projectType"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Project Type
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <Briefcase size={18} />
                    </div>
                    <select
                      id="projectType"
                      value={formData.projectType}
                      onChange={(e) =>
                        setFormData({ ...formData, projectType: e.target.value })
                      }
                      className="w-full bg-dark-bg border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none"
                    >
                      <option value="Job Portal">Job Portal</option>
                      <option value="AI Backend">AI Backend</option>
                      <option value="Fullstack">Fullstack MERN</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="budget"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Budget Range
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <DollarSign size={18} />
                    </div>
                    <select
                      id="budget"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      className="w-full bg-dark-bg border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none"
                    >
                      <option value="< $1k">&lt; $1,000</option>
                      <option value="$1k - $5k">$1,000 - $5,000</option>
                      <option value="$5k - $10k">$5,000 - $10,000</option>
                      <option value="> $10k">&gt; $10,000</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Project Details
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-gray-500">
                    <FileText size={18} />
                  </div>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-dark-bg border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none placeholder:text-gray-600"
                    placeholder="Tell me about your project goals, timeline, and any specific requirements..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 rounded-xl bg-accent text-dark-bg font-bold hover:bg-white transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,212,255,0.2)] hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] mt-4"
              >
                {status === "loading" ? (
                  <span className="animate-pulse flex items-center">
                    <div className="w-5 h-5 border-2 border-dark-bg border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending Message...
                  </span>
                ) : (
                  <>
                    Send Message <Send size={18} className="ml-2" />
                  </>
                )}
              </button>

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center text-success bg-success/10 p-4 rounded-xl border border-success/20 mt-4"
                >
                  <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                  <p className="text-sm font-medium">{responseMsg}</p>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 mt-4"
                >
                  <AlertCircle size={20} className="mr-3 flex-shrink-0" />
                  <p className="text-sm font-medium">{responseMsg}</p>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

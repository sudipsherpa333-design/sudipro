import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  ArrowRight
} from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  whatsapp: z.string().optional(),
  projectType: z.string(),
  budget: z.string(),
  message: z.string().min(10, "Please provide more details about your project"),
});

type FormData = z.infer<typeof formSchema>;

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      projectType: "Fullstack",
      budget: "< $1k",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const contentType = res.headers.get("content-type");
      let responseData;
      if (contentType && contentType.includes("application/json")) {
        responseData = await res.json();
      } else {
        throw new Error("Received non-JSON response from server");
      }

      if (res.ok) {
        setStatus("success");
        setResponseMsg(responseData.message || "Message sent successfully!");
        reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setResponseMsg(responseData.message || "Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setResponseMsg("Failed to send message. Please try again.");
    }
  };

  const inputClasses = "block w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-500 hover:bg-white/10 relative z-20";
  const labelClasses = "block text-sm font-medium text-gray-400 mb-2 ml-1 relative z-20";
  const iconClasses = "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-accent transition-colors z-30";
  const errorClasses = "text-red-400 text-xs mt-1 ml-1 absolute -bottom-5 left-0";

  return (
    <section id="contact" className="py-32 px-4 bg-dark-bg relative overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left Column: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 sticky top-32"
          >
            <div className="inline-flex items-center mb-6 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm font-mono tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-accent mr-3 animate-pulse"></span>
              Available for work
            </div>

            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-tight">
              Let's build <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">together.</span>
            </h2>

            <p className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed">
              Ready to transform your ideas into a high-performance MERN application? Drop me a message and let's discuss your vision.
            </p>

            <div className="space-y-8">
              {[
                { icon: Mail, label: "Email", value: "sudipsherpa999@gmail.com", href: "mailto:sudipsherpa999@gmail.com" },
                { icon: Phone, label: "WhatsApp", value: "+977 9813319831", href: "https://wa.me/9779813319831" },
                { icon: MapPin, label: "Location", value: "Kathmandu, Nepal", href: null }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="flex items-center space-x-6 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-accent group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-500 shadow-lg">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 font-mono mb-1 uppercase tracking-wider">
                      {item.label}
                    </h4>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-xl font-medium text-white hover:text-accent transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-xl font-medium text-white">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Decorative glow inside the card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10" data-lenis-prevent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6">
                  <div className="group relative">
                    <label htmlFor="name" className={labelClasses}>Full Name <span className="text-accent">*</span></label>
                    <div className="relative">
                      <div className={iconClasses}><User size={18} /></div>
                      <input
                        type="text"
                        id="name"
                        {...register("name")}
                        className={`${inputClasses} ${errors.name ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400' : ''}`}
                        placeholder="Sudipro"
                      />
                    </div>
                    {errors.name && <span className={errorClasses}>{errors.name.message}</span>}
                  </div>
                  <div className="group relative">
                    <label htmlFor="email" className={labelClasses}>Email Address <span className="text-accent">*</span></label>
                    <div className="relative">
                      <div className={iconClasses}><Mail size={18} /></div>
                      <input
                        type="email"
                        id="email"
                        {...register("email")}
                        className={`${inputClasses} ${errors.email ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400' : ''}`}
                        placeholder="sudipro@gmail.com"
                      />
                    </div>
                    {errors.email && <span className={errorClasses}>{errors.email.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6">
                  <div className="group relative">
                    <label htmlFor="whatsapp" className={labelClasses}>WhatsApp (Optional)</label>
                    <div className="relative">
                      <div className={iconClasses}><Phone size={18} /></div>
                      <input
                        type="tel"
                        id="whatsapp"
                        {...register("whatsapp")}
                        className={inputClasses}
                        placeholder="+977 981331****"
                      />
                    </div>
                  </div>
                  <div className="group relative">
                    <label htmlFor="budget" className={labelClasses}>Budget Range</label>
                    <div className="relative">
                      <div className={iconClasses}><DollarSign size={18} /></div>
                      <select
                        id="budget"
                        {...register("budget")}
                        className={`${inputClasses} appearance-none`}
                      >
                        <option value="< $1k" className="bg-dark-surface">&lt; रु.10,000</option>
                        <option value="$1k - $5k" className="bg-dark-surface">रु.25,0000 - रु.50,000</option>
                        <option value="$5k - $10k" className="bg-dark-surface">रु.1,15,000 - रु.1,50,000</option>
                        <option value="> $10k" className="bg-dark-surface">&gt; रु.3,00000</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-gray-500 z-30">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative">
                  <label htmlFor="projectType" className={labelClasses}>Project Type</label>
                  <div className="relative">
                    <div className={iconClasses}><Briefcase size={18} /></div>
                    <select
                      id="projectType"
                      {...register("projectType")}
                      className={`${inputClasses} appearance-none`}
                    >
                      <option value="Fullstack" className="bg-dark-surface">Fullstack MERN Application</option>
                      <option value="AI Backend" className="bg-dark-surface">AI Integration / Backend</option>
                      <option value="Job Portal" className="bg-dark-surface">Job Portal / SaaS</option>
                      <option value="Other" className="bg-dark-surface">Other Custom Project</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-gray-500 z-30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="group relative z-20">
                  <label htmlFor="message" className={labelClasses}>Project Details <span className="text-accent">*</span></label>
                  <div className="relative">
                    <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-gray-500 group-focus-within:text-accent transition-colors z-30">
                      <FileText size={18} />
                    </div>
                    <textarea
                      id="message"
                      {...register("message")}
                      rows={4}
                      className={`${inputClasses} resize-none ${errors.message ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400' : ''}`}
                      placeholder="Tell me about your goals, timeline, and specific requirements..."
                    />
                  </div>
                  {errors.message && <span className={errorClasses}>{errors.message.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || status === "loading"}
                  className="w-full py-5 rounded-2xl bg-white text-dark-bg font-bold hover:bg-accent transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group/btn overflow-hidden relative mt-8"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                  {isSubmitting || status === "loading" ? (
                    <span className="flex items-center relative z-10">
                      <div className="w-5 h-5 border-2 border-dark-bg border-t-transparent rounded-full animate-spin mr-3"></div>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center relative z-10 text-lg">
                      Send Message <ArrowRight size={20} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center text-success bg-success/10 p-4 rounded-2xl border border-success/20 overflow-hidden mt-4"
                    >
                      <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                      <p className="text-sm font-medium">{responseMsg}</p>
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center text-red-400 bg-red-400/10 p-4 rounded-2xl border border-red-400/20 overflow-hidden mt-4"
                    >
                      <AlertCircle size={20} className="mr-3 flex-shrink-0" />
                      <p className="text-sm font-medium">{responseMsg}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

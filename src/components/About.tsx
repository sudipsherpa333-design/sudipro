import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Code2, Users, Target } from "lucide-react";

const TIMELINE = [
  {
    year: "2024",
    title: "BCA Student, Kathmandu",
    description:
      "Began deep dive into full-stack development and AI integration.",
    icon: <GraduationCap size={24} className="text-accent" />,
  },
  {
    year: "2025",
    title: "AI Resume Builder",
    description: "Launched first production app with OpenAI integration.",
    icon: <Code2 size={24} className="text-accent" />,
  },
  {
    year: "2026",
    title: "TalentSphere Job Portal",
    description: "Built scalable job matching platform for Nepal tech market.",
    icon: <Briefcase size={24} className="text-accent" />,
  },
];

const STATS = [
  { label: "Production MERN Apps", value: "2", icon: <Code2 size={20} /> },
  { label: "Active Users", value: "500+", icon: <Users size={20} /> },
  { label: "Job Match Accuracy", value: "85%", icon: <Target size={20} /> },
];

export default function About() {
  return (
    <section id="about" className="py-32 px-4 bg-dark-bg relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-accent">Me</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              I'm a BCA student based in Kathmandu, Nepal, specializing in
              building AI-powered job platforms and scalable web applications.
              My focus is on delivering high-performance, production-ready MERN
              stack solutions that solve real-world problems.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              {STATS.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="glass p-6 rounded-2xl text-center"
                >
                  <div className="flex justify-center mb-4 text-accent">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 font-mono">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />

            <div className="space-y-12">
              {TIMELINE.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.3, duration: 0.5 }}
                  className="relative pl-20"
                >
                  <div className="absolute left-4 top-0 w-8 h-8 rounded-full bg-dark-surface border border-accent/30 flex items-center justify-center z-10">
                    {item.icon}
                  </div>

                  <div className="glass p-6 rounded-2xl relative group hover:border-accent/50 transition-colors">
                    <div className="absolute -left-3 top-4 w-3 h-3 bg-dark-surface border-t border-l border-white/10 rotate-45 group-hover:border-accent/50 transition-colors" />
                    <span className="text-accent font-mono text-sm mb-2 block">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

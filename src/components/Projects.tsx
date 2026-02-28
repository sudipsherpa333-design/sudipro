import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, X, PlayCircle } from "lucide-react";

interface Project {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  metrics: string;
  tech: string[];
  demoUrl: string;
  githubUrl: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        } else {
          const text = await res.text();
          throw new Error(`Expected JSON, got ${contentType}. Body: ${text.substring(0, 100)}`);
        }
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("Expected array of projects, got:", data);
          setProjects([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setProjects([]);
      });
  }, []);

  return (
    <section id="projects" className="py-32 px-4 bg-dark-bg relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-accent">Projects</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Real-world applications built with the MERN stack and AI
            integrations. Focused on performance, scalability, and user
            experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project._id || project.id || index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onClick={() => setSelectedProject(project)}
              className="glass glass-hover rounded-2xl p-8 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex space-x-3">
                    <a
                      href={project.githubUrl}
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Github size={20} />
                    </a>
                    <a
                      href={project.demoUrl}
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-accent transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 line-clamp-2">
                  {project.description}
                </p>

                <div className="mb-6 flex items-center text-success font-mono text-sm">
                  <PlayCircle size={16} className="mr-2" />
                  {project.metrics}
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 text-xs font-mono rounded-full bg-white/5 border border-white/10 text-gray-300 group-hover:border-accent/30 group-hover:text-white transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-surface border border-white/10 rounded-3xl p-8 max-w-3xl w-full relative"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className="text-3xl font-bold mb-4">
                {selectedProject.title}
              </h3>
              <p className="text-gray-300 text-lg mb-8">
                {selectedProject.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-accent font-mono text-sm mb-2 uppercase tracking-wider">
                    Key Metrics
                  </h4>
                  <p className="text-xl font-medium text-success">
                    {selectedProject.metrics}
                  </p>
                </div>
                <div>
                  <h4 className="text-accent font-mono text-sm mb-2 uppercase tracking-wider">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 text-xs font-mono rounded-full bg-white/5 border border-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="aspect-video bg-black/50 rounded-xl mb-8 flex items-center justify-center border border-white/5">
                <div className="text-center text-gray-500">
                  <PlayCircle size={48} className="mx-auto mb-2 opacity-50" />
                  <p>30-sec Demo Video Placeholder</p>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href={selectedProject.demoUrl}
                  className="flex-1 py-3 rounded-full bg-accent text-dark-bg font-semibold hover:bg-white transition-colors text-center flex items-center justify-center"
                >
                  <ExternalLink size={18} className="mr-2" /> Live Demo
                </a>
                <a
                  href={selectedProject.githubUrl}
                  className="flex-1 py-3 rounded-full glass glass-hover text-white font-semibold transition-all text-center flex items-center justify-center"
                >
                  <Github size={18} className="mr-2" /> Source Code
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

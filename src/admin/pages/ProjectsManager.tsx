import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function ProjectsManager() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const res = await fetch("/api/admin/projects");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] }),
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = editingProject
        ? `/api/admin/projects/${editingProject._id}`
        : "/api/admin/projects";
      const method = editingProject ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      setIsModalOpen(false);
      setEditingProject(null);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      metrics: formData.get("metrics"),
      tech: formData
        .get("tech")
        ?.toString()
        .split(",")
        .map((t) => t.trim()),
      demoUrl: formData.get("demoUrl"),
      githubUrl: formData.get("githubUrl"),
      category: formData.get("category"),
      featured: formData.get("featured") === "on",
    };
    saveMutation.mutate(data);
  };

  if (isLoading) return <div>Loading projects...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects Manager</h1>
        <button
          onClick={() => {
            setEditingProject(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-accent text-dark-bg font-bold rounded-lg hover:bg-white transition-colors"
        >
          <Plus size={20} />
          <span>Add Project</span>
        </button>
      </div>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 font-medium text-gray-400">Title</th>
              <th className="p-4 font-medium text-gray-400">Category</th>
              <th className="p-4 font-medium text-gray-400">Featured</th>
              <th className="p-4 font-medium text-gray-400">Clicks</th>
              <th className="p-4 font-medium text-gray-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(projects) && projects.map((project: any) => (
              <tr
                key={project._id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4 font-medium">{project.title}</td>
                <td className="p-4 text-gray-400">{project.category}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-mono ${project.featured ? "bg-success/20 text-success" : "bg-white/10 text-gray-400"}`}
                  >
                    {project.featured ? "Yes" : "No"}
                  </span>
                </td>
                <td className="p-4 text-gray-400">{project.clicks}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete project?"))
                        deleteMutation.mutate(project._id);
                    }}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!Array.isArray(projects) || projects.length === 0) && (
          <div className="p-8 text-center text-gray-500">No projects added yet.</div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-dark-surface border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingProject ? "Edit Project" : "New Project"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Title
                  </label>
                  <input
                    name="title"
                    defaultValue={editingProject?.title}
                    required
                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingProject?.description}
                    required
                    rows={3}
                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Metrics (e.g. 500+ users)
                    </label>
                    <input
                      name="metrics"
                      defaultValue={editingProject?.metrics}
                      required
                      className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      defaultValue={editingProject?.category || "MERN"}
                      className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                    >
                      <option>MERN</option>
                      <option>AI</option>
                      <option>Freelance</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    name="tech"
                    defaultValue={editingProject?.tech?.join(", ")}
                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Demo URL
                    </label>
                    <input
                      name="demoUrl"
                      defaultValue={editingProject?.demoUrl}
                      className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      GitHub URL
                    </label>
                    <input
                      name="githubUrl"
                      defaultValue={editingProject?.githubUrl}
                      className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    defaultChecked={editingProject?.featured}
                    className="w-4 h-4 accent-accent"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-400">
                    Featured Project (Shows in Hero)
                  </label>
                </div>

                <div className="pt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="px-6 py-2 bg-accent text-dark-bg font-bold rounded-lg hover:bg-white transition-colors"
                  >
                    {saveMutation.isPending ? "Saving..." : "Save Project"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

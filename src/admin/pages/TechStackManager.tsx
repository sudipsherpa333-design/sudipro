import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function TechStackManager() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<any>(null);

  const { data: techStack, isLoading } = useQuery({
    queryKey: ["admin-techstack"],
    queryFn: async () => {
      const res = await fetch("/api/admin/techstack");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/admin/techstack/${id}`, { method: "DELETE" });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-techstack"] }),
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = editingTech
        ? `/api/admin/techstack/${editingTech._id}`
        : "/api/admin/techstack";
      const method = editingTech ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-techstack"] });
      setIsModalOpen(false);
      setEditingTech(null);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      category: formData.get("category"),
      proficiency: Number(formData.get("proficiency")),
      order: Number(formData.get("order")),
    };
    saveMutation.mutate(data);
  };

  if (isLoading) return <div>Loading tech stack...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tech Stack Manager</h1>
        <button
          onClick={() => {
            setEditingTech(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-accent text-dark-bg font-bold rounded-lg hover:bg-white transition-colors"
        >
          <Plus size={20} />
          <span>Add Tech</span>
        </button>
      </div>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 font-medium text-gray-400">Name</th>
              <th className="p-4 font-medium text-gray-400">Category</th>
              <th className="p-4 font-medium text-gray-400">Proficiency</th>
              <th className="p-4 font-medium text-gray-400">Order</th>
              <th className="p-4 font-medium text-gray-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(techStack) && techStack.map((tech: any) => (
              <tr
                key={tech._id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4 font-medium">{tech.name}</td>
                <td className="p-4 text-gray-400">{tech.category}</td>
                <td className="p-4">
                  <div className="w-full bg-dark-bg rounded-full h-2.5 max-w-[100px]">
                    <div
                      className="bg-accent h-2.5 rounded-full"
                      style={{ width: `${tech.proficiency}%` }}
                    ></div>
                  </div>
                </td>
                <td className="p-4 text-gray-400">{tech.order}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditingTech(tech);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete tech?"))
                        deleteMutation.mutate(tech._id);
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
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-dark-surface border border-white/10 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingTech ? "Edit Tech" : "New Tech"}
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
                    Name
                  </label>
                  <input
                    name="name"
                    defaultValue={editingTech?.name}
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
                    defaultValue={editingTech?.category || "Frontend"}
                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                  >
                    <option>Frontend</option>
                    <option>Backend</option>
                    <option>AI</option>
                    <option>Tools</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Proficiency (%)
                  </label>
                  <input
                    type="number"
                    name="proficiency"
                    min="0"
                    max="100"
                    defaultValue={editingTech?.proficiency || 80}
                    required
                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Order (for 3D orbit)
                  </label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingTech?.order || 0}
                    required
                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                  />
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
                    {saveMutation.isPending ? "Saving..." : "Save Tech"}
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

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function BlogsManager() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [content, setContent] = useState("");

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/blogs");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] }),
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = editingBlog
        ? `/api/admin/blogs/${editingBlog._id}`
        : "/api/admin/blogs";
      const method = editingBlog ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      setIsModalOpen(false);
      setEditingBlog(null);
      setContent("");
      setIsPreview(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const data = {
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
      excerpt: formData.get("excerpt"),
      content: content,
      featuredImage: formData.get("featuredImage"),
      category: formData.get("category"),
      tags: formData
        .get("tags")
        ?.toString()
        .split(",")
        .map((t) => t.trim()),
      published: formData.get("published") === "on",
    };
    saveMutation.mutate(data);
  };

  if (isLoading) return <div>Loading blogs...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Advanced Blog Manager</h1>
        <button
          onClick={() => {
            setEditingBlog(null);
            setContent("");
            setIsPreview(false);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-accent text-dark-bg font-bold rounded-lg hover:bg-white transition-colors"
        >
          <Plus size={20} />
          <span>New Post</span>
        </button>
      </div>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 font-medium text-gray-400">Title</th>
              <th className="p-4 font-medium text-gray-400">Category</th>
              <th className="p-4 font-medium text-gray-400">Status</th>
              <th className="p-4 font-medium text-gray-400">Views</th>
              <th className="p-4 font-medium text-gray-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(blogs) && blogs.map((blog: any) => (
              <tr
                key={blog._id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4 font-medium">{blog.title}</td>
                <td className="p-4 text-gray-400">{blog.category}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-mono ${blog.published ? "bg-success/20 text-success" : "bg-yellow-500/20 text-yellow-500"}`}
                  >
                    {blog.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-4 text-gray-400">{blog.views}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditingBlog(blog);
                      setContent(blog.content);
                      setIsPreview(false);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete post?"))
                        deleteMutation.mutate(blog._id);
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
              className="bg-dark-surface border border-white/10 rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingBlog ? "Edit Post" : "New Post"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Title
                    </label>
                    <input
                      name="title"
                      defaultValue={editingBlog?.title}
                      required
                      className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Featured Image URL
                    </label>
                    <input
                      name="featuredImage"
                      defaultValue={editingBlog?.featuredImage}
                      placeholder="https://picsum.photos/seed/blog/800/400"
                      className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Excerpt (Short summary)
                  </label>
                  <textarea
                    name="excerpt"
                    defaultValue={editingBlog?.excerpt}
                    rows={2}
                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      defaultValue={editingBlog?.category || "MERN"}
                      className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                    >
                      <option>MERN</option>
                      <option>AI</option>
                      <option>Freelancing</option>
                      <option>Nepal Tech</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      name="tags"
                      defaultValue={editingBlog?.tags?.join(", ")}
                      className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                    />
                  </div>
                </div>

                <div className="border border-white/10 rounded-lg overflow-hidden">
                  <div className="flex bg-white/5 border-b border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsPreview(false)}
                      className={`px-4 py-2 text-sm font-medium ${!isPreview ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      Markdown Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPreview(true)}
                      className={`px-4 py-2 text-sm font-medium flex items-center ${isPreview ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Eye size={16} className="mr-2" /> Preview
                    </button>
                  </div>
                  
                  {isPreview ? (
                    <div className="p-4 bg-dark-bg min-h-[300px] prose prose-invert max-w-none">
                      <ReactMarkdown>{content || '*No content provided*'}</ReactMarkdown>
                    </div>
                  ) : (
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                      rows={12}
                      className="w-full bg-dark-bg p-4 text-white focus:outline-none font-mono text-sm resize-y"
                      placeholder="# Write your blog post in Markdown..."
                    />
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    name="published"
                    id="published"
                    defaultChecked={editingBlog?.published}
                    className="w-4 h-4 accent-accent"
                  />
                  <label htmlFor="published" className="text-sm text-gray-400">
                    Publish immediately
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
                    {saveMutation.isPending ? "Saving..." : "Save Post"}
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

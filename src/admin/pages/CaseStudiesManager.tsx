import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, TrendingUp } from 'lucide-react';

export default function CaseStudiesManager() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<any>(null);

  const { data: studies, isLoading } = useQuery({
    queryKey: ['admin-case-studies'],
    queryFn: async () => {
      const res = await fetch('/api/admin/case-studies');
      return res.json();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/admin/case-studies/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-case-studies'] })
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = editingStudy ? `/api/admin/case-studies/${editingStudy._id}` : '/api/admin/case-studies';
      const method = editingStudy ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-case-studies'] });
      setIsModalOpen(false);
      setEditingStudy(null);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      clientName: formData.get('clientName'),
      description: formData.get('description'),
      roi: formData.get('roi'),
      metrics: formData.get('metrics')?.toString().split('\n').filter(m => m.trim() !== ''),
      featured: formData.get('featured') === 'on'
    };
    saveMutation.mutate(data);
  };

  if (isLoading) return <div>Loading case studies...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <TrendingUp className="mr-3 text-accent" /> Case Studies ROI
        </h1>
        <button
          onClick={() => { setEditingStudy(null); setIsModalOpen(true); }}
          className="flex items-center space-x-2 px-4 py-2 bg-accent text-dark-bg font-bold rounded-lg hover:bg-white transition-colors"
        >
          <Plus size={20} />
          <span>Add Case Study</span>
        </button>
      </div>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 font-medium text-gray-400">Client</th>
              <th className="p-4 font-medium text-gray-400">Title</th>
              <th className="p-4 font-medium text-gray-400">ROI</th>
              <th className="p-4 font-medium text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {studies?.map((study: any) => (
              <tr key={study._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-accent">{study.clientName}</td>
                <td className="p-4 font-medium">{study.title}</td>
                <td className="p-4 font-bold text-success">{study.roi}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => { setEditingStudy(study); setIsModalOpen(true); }}
                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => { if(confirm('Delete case study?')) deleteMutation.mutate(study._id) }}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {studies?.length === 0 && (
          <div className="p-8 text-center text-gray-500">No case studies added yet.</div>
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
                <h2 className="text-2xl font-bold">{editingStudy ? 'Edit Case Study' : 'New Case Study'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Client Name</label>
                    <input name="clientName" defaultValue={editingStudy?.clientName} required className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Total ROI (e.g. 3.2x or NPR 2.3L)</label>
                    <input name="roi" defaultValue={editingStudy?.roi} required className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none font-bold text-success" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Project Title</label>
                  <input name="title" defaultValue={editingStudy?.title} required className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea name="description" defaultValue={editingStudy?.description} required rows={3} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Metrics (One per line, e.g. "Pass Rate: 92%")</label>
                  <textarea name="metrics" defaultValue={editingStudy?.metrics?.join('\n')} required rows={4} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none font-mono text-sm" placeholder="Pass Rate: 92%&#10;Students Served: 527" />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <input type="checkbox" name="featured" id="featured" defaultChecked={editingStudy?.featured} className="w-4 h-4 accent-accent" />
                  <label htmlFor="featured" className="text-sm text-gray-400">Featured Case Study</label>
                </div>

                <div className="pt-6 flex justify-end space-x-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg text-gray-400 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" disabled={saveMutation.isPending} className="px-6 py-2 bg-accent text-dark-bg font-bold rounded-lg hover:bg-white transition-colors">
                    {saveMutation.isPending ? 'Saving...' : 'Save Case Study'}
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

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, ArrowUpRight, ArrowRight } from 'lucide-react';

export default function CaseStudies() {
  const { data: studies, isLoading } = useQuery({
    queryKey: ['public-case-studies'],
    queryFn: async () => {
      const res = await fetch('/api/case-studies');
      return res.json();
    }
  });

  if (isLoading) return <div className="min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto text-white">Loading case studies...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-mono tracking-wider">
          SYSTEM 3: ROI DASHBOARD
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          Real Client Results
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          See how my MERN and AI solutions have transformed businesses, increased revenue, and streamlined operations.
        </p>
      </motion.div>

      <div className="space-y-12">
        {Array.isArray(studies) && studies.map((study: any, index: number) => (
          <motion.div
            key={study._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="glass rounded-3xl border border-white/10 overflow-hidden flex flex-col md:flex-row"
          >
            {/* Image/Visual Side */}
            <div className="md:w-2/5 bg-dark-surface p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
              <div>
                <div className="text-accent font-mono text-sm mb-2">{study.clientName}</div>
                <h3 className="text-3xl font-bold mb-6">{study.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-8">{study.description}</p>
              </div>
              
              <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6">
                <div className="flex items-center text-accent mb-2">
                  <TrendingUp size={20} className="mr-2" />
                  <span className="font-bold uppercase tracking-wider text-sm">Total ROI</span>
                </div>
                <div className="text-3xl font-bold text-white">{study.roi}</div>
              </div>
            </div>

            {/* Metrics Side */}
            <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <h4 className="text-xl font-bold mb-8 flex items-center">
                <Users className="mr-3 text-gray-400" /> Key Performance Metrics
              </h4>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {Array.isArray(study.metrics) && study.metrics.map((metric: string, i: number) => {
                  // Simple parsing to highlight numbers
                  const parts = metric.split(':');
                  const label = parts[0];
                  const value = parts.length > 1 ? parts[1] : metric;

                  return (
                    <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="text-gray-400 text-sm mb-2">{label}</div>
                      <div className="text-2xl font-bold text-white flex items-center">
                        {parts.length > 1 ? value : ''}
                        {i === 0 && <ArrowUpRight size={24} className="ml-2 text-success" />}
                        {i === 1 && <DollarSign size={24} className="ml-2 text-accent" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 pt-8 border-t border-white/10">
                <a 
                  href="/contact" 
                  className="inline-flex items-center text-accent hover:text-white transition-colors font-bold"
                >
                  Start a similar project <ArrowRight size={20} className="ml-2" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}

        {(!Array.isArray(studies) || studies.length === 0) && (
          <div className="text-center py-20 text-gray-500 glass rounded-3xl border border-white/10">
            No case studies available yet.
          </div>
        )}
      </div>
    </div>
  );
}

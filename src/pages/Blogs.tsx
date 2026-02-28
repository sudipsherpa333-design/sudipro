import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function Blogs() {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['public-blogs'],
    queryFn: async () => {
      const res = await fetch('/api/blogs');
      return res.json();
    }
  });

  if (isLoading) return <div className="min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto text-white">Loading blogs...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-mono tracking-wider">
          INSIGHTS & TUTORIALS
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          The Developer Blog
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Deep dives into MERN stack development, AI integrations, and freelance business strategies.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {Array.isArray(blogs) && blogs.filter((b: any) => b.published).map((blog: any, index: number) => (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="glass rounded-3xl border border-white/10 overflow-hidden group flex flex-col"
          >
            {blog.featuredImage && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={blog.featuredImage} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <div className="p-8 flex flex-col flex-1">
              <div className="flex items-center space-x-4 text-xs text-gray-400 mb-4 font-mono">
                <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center"><Clock size={14} className="mr-1" /> {Math.ceil(blog.content.length / 1000)} min read</span>
                <span className="px-2 py-1 bg-white/5 rounded-full text-accent">{blog.category}</span>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
                <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
              </h3>
              
              <p className="text-gray-400 mb-6 line-clamp-3 flex-1">
                {blog.excerpt || blog.content.substring(0, 150) + '...'}
              </p>
              
              <Link 
                to={`/blog/${blog.slug}`}
                className="inline-flex items-center text-accent font-bold hover:text-white transition-colors mt-auto"
              >
                Read Article <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </motion.div>
        ))}

        {(!Array.isArray(blogs) || blogs.filter((b: any) => b.published).length === 0) && (
          <div className="col-span-2 text-center py-20 text-gray-500 glass rounded-3xl border border-white/10">
            No articles published yet. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
}

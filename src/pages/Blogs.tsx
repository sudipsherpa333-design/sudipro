import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

export default function Blogs() {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['public-blogs'],
    queryFn: async () => {
      const res = await fetch('/api/blogs');
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return res.json();
      }
      return [];
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4 max-w-6xl mx-auto flex justify-center">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const publishedBlogs = Array.isArray(blogs) ? blogs.filter((b: any) => b.published) : [];
  const featuredBlog = publishedBlogs.length > 0 ? publishedBlogs[0] : null;
  const regularBlogs = publishedBlogs.length > 1 ? publishedBlogs.slice(1) : [];

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 max-w-6xl mx-auto relative">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20 relative z-10"
      >
        <div className="inline-flex items-center mb-6 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm font-mono tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-accent mr-3 animate-pulse"></span>
          Insights & Tutorials
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          The Developer <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">Journal</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl">
          Deep dives into MERN stack development, AI integrations, and freelance business strategies.
        </p>
      </motion.div>

      {publishedBlogs.length === 0 ? (
        <div className="text-center py-32 text-gray-500 glass rounded-3xl border border-white/10 relative z-10">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Tag size={32} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-white">No articles yet</h3>
          <p>Check back soon for new content!</p>
        </div>
      ) : (
        <div className="space-y-12 relative z-10">
          {/* Featured Post */}
          {featuredBlog && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-[2.5rem] border border-white/10 overflow-hidden group grid md:grid-cols-2 gap-0"
            >
              <div className="h-64 md:h-full min-h-[300px] overflow-hidden relative">
                {featuredBlog.featuredImage ? (
                  <img 
                    src={featuredBlog.featuredImage} 
                    alt={featuredBlog.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-dark-surface to-dark-bg flex items-center justify-center">
                    <span className="text-accent/20 font-bold text-4xl">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent md:hidden" />
              </div>
              
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6 font-mono">
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full border border-accent/20">
                    {featuredBlog.category || 'Article'}
                  </span>
                  <span className="flex items-center"><Calendar size={14} className="mr-1.5" /> {new Date(featuredBlog.createdAt).toLocaleDateString()}</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6 group-hover:text-accent transition-colors leading-tight">
                  <Link to={`/blog/${featuredBlog.slug}`}>{featuredBlog.title}</Link>
                </h2>
                
                <p className="text-gray-400 mb-8 text-lg line-clamp-3">
                  {featuredBlog.excerpt || featuredBlog.content.substring(0, 200) + '...'}
                </p>
                
                <Link 
                  to={`/blog/${featuredBlog.slug}`}
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all w-fit group/btn"
                >
                  Read Full Article 
                  <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Regular Posts Grid */}
          {regularBlogs.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularBlogs.map((blog: any, index: number) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="glass rounded-3xl border border-white/10 overflow-hidden group flex flex-col hover:-translate-y-2 transition-transform duration-300"
                >
                  <Link to={`/blog/${blog.slug}`} className="block h-48 overflow-hidden relative">
                    {blog.featuredImage ? (
                      <img 
                        src={blog.featuredImage} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-dark-surface flex items-center justify-center">
                        <span className="text-white/10 font-bold">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-dark-bg/80 backdrop-blur-md text-accent text-xs font-mono rounded-full border border-white/10">
                      {blog.category || 'Article'}
                    </div>
                  </Link>
                  
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4 font-mono">
                      <span className="flex items-center"><Calendar size={14} className="mr-1.5" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center"><Clock size={14} className="mr-1.5" /> {Math.ceil(blog.content.length / 1000)} min</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                    
                    <p className="text-gray-400 mb-6 line-clamp-3 text-sm flex-1">
                      {blog.excerpt || blog.content.substring(0, 120) + '...'}
                    </p>
                    
                    <Link 
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center text-sm text-accent font-bold hover:text-white transition-colors mt-auto group/link"
                    >
                      Read Article <ArrowRight size={14} className="ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

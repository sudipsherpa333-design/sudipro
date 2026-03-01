import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Tag, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const { slug } = useParams();
  
  const { data: blog, isLoading } = useQuery({
    queryKey: ['public-blog', slug],
    queryFn: async () => {
      const res = await fetch(`/api/blogs/${slug}`);
      if (!res.ok) throw new Error('Post not found');
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4 max-w-4xl mx-auto flex justify-center">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Post not found</h2>
        <Link to="/blog" className="text-accent hover:underline">Return to Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 max-w-4xl mx-auto relative">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Link to="/blog" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-12 group">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover:bg-white/10 transition-colors border border-white/10">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        </div>
        <span className="font-medium tracking-wide">Back to Journal</span>
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <header className="mb-12 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 mb-8 font-mono">
            <span className="px-4 py-1.5 bg-accent/10 text-accent rounded-full border border-accent/20 tracking-wider uppercase text-xs font-bold">
              {blog.category || 'Article'}
            </span>
            <span className="flex items-center"><Calendar size={16} className="mr-2" /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="flex items-center"><Clock size={16} className="mr-2" /> {Math.ceil(blog.content.length / 1000)} min read</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-[1.1]">
            {blog.title}
          </h1>
          
          {blog.excerpt && (
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {blog.excerpt}
            </p>
          )}
        </header>

        {blog.featuredImage && (
          <div className="w-full h-64 md:h-[500px] rounded-[2rem] overflow-hidden mb-16 border border-white/10 shadow-2xl relative">
            <img 
              src={blog.featuredImage} 
              alt={blog.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/40 to-transparent" />
          </div>
        )}

        <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10">
          <div className="prose prose-invert prose-lg prose-accent max-w-none prose-headings:tracking-tight prose-a:text-accent hover:prose-a:text-white prose-img:rounded-2xl prose-pre:bg-dark-bg/80 prose-pre:border prose-pre:border-white/10">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            {blog.tags && blog.tags.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <Tag size={18} className="text-gray-500 mr-2" />
                {blog.tags.map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            ) : <div />}
            
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">
              <Share2 size={16} />
              <span>Share Article</span>
            </button>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

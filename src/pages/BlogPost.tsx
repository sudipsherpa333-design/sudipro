import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
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

  if (isLoading) return <div className="min-h-screen pt-24 pb-12 px-4 max-w-3xl mx-auto text-white">Loading post...</div>;
  if (!blog) return <div className="min-h-screen pt-24 pb-12 px-4 max-w-3xl mx-auto text-white">Post not found.</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-3xl mx-auto">
      <Link to="/blog" className="inline-flex items-center text-gray-400 hover:text-accent transition-colors mb-8">
        <ArrowLeft size={20} className="mr-2" /> Back to Blog
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl border border-white/10 overflow-hidden"
      >
        {blog.featuredImage && (
          <div className="w-full h-64 md:h-96 overflow-hidden">
            <img 
              src={blog.featuredImage} 
              alt={blog.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <div className="p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6 font-mono">
            <span className="flex items-center"><Calendar size={16} className="mr-2" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center"><Clock size={16} className="mr-2" /> {Math.ceil(blog.content.length / 1000)} min read</span>
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full border border-accent/20">{blog.category}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8 leading-tight">
            {blog.title}
          </h1>

          <div className="prose prose-invert prose-accent max-w-none">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-2">
              <Tag size={18} className="text-gray-500 mr-2 mt-1" />
              {blog.tags.map((tag: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300 border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.article>
    </div>
  );
}

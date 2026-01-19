import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom';
import { showArticle } from '../services/articleService';
import ArticleSkeleton from '@/components/common/ArticleSkeleton';
import DOMPurify from 'dompurify';
import { FaEye, FaShare } from "react-icons/fa";

const DetailBlog = () => {
  const { slug } = useParams();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const articleData = await showArticle(slug);
        setPost(articleData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="py-10 px-32">
          <ArticleSkeleton />
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/404" />;
  }

  return (
    <div className='py-24 px-6 md:px-32 max-w-4xl mx-auto'>
      <Link to={"/blog"} className="text-sm uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-12 inline-block">
        &larr; Journal
      </Link>
      
      <div className="mb-16">
        <h1 className='text-4xl md:text-6xl font-serif font-medium text-gray-900 mb-8 leading-tight'>{post.title}</h1>
        
        <div className="flex items-center justify-between border-t border-b border-gray-100 py-6">
            <div className="flex items-center space-x-8 text-sm text-gray-400 font-mono">
                <span>
                    {post.date?.toDate ? post.date.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
                </span>
                <span className="flex items-center">
                    <FaEye className="mr-2" />
                    {post.views || 0}
                </span>
            </div>

            <button 
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied!");
                }}
                className="text-gray-400 hover:text-black transition-colors"
                title="Share"
            >
                <FaShare />
            </button>
        </div>
      </div>

      <div 
        className="prose prose-lg max-w-none prose-blue prose-headings:font-bold prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-blue-500 hover:prose-a:underline prose-img:rounded-xl shadow-none"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.description) }}
      />
    </div>
  )
}

export default DetailBlog
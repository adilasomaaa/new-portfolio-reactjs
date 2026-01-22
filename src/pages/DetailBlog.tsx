import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom';
import { showArticle } from '../services/articleService';
import DOMPurify from 'dompurify';
import { FaEye, FaShare } from "react-icons/fa";

import useVisitorTracker from '../hooks/useVisitorTracker';
import { Helmet } from 'react-helmet-async';

const stripHtml = (html: string) => {
   const tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

const DetailBlog = () => {
  const { slug } = useParams();
  
  useVisitorTracker(`Blog Detail: ${slug}`);

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
      <div className="py-24 px-6 md:px-32 max-w-4xl mx-auto">
            <div className="animate-pulse flex flex-col md:flex-row gap-8">
                <div className="md:w-1/4 h-4 bg-gray-100 rounded"></div>
                <div className="md:w-3/4 space-y-3">
                    <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                </div>
            </div>
        </div>
    );
  }

  if (!post) {
    return <Navigate to="/404" />;
  }

  return (
    <div className='py-24 px-6 md:px-32 max-w-4xl mx-auto'>
      <Helmet>
        <title>{post.title} | Adi's Journal</title>
        <meta name="description" content={post.description ? stripHtml(post.description).substring(0, 160) : "Blog detail"} />
      </Helmet>
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
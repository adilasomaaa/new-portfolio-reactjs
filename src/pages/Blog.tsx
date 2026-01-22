import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getAllArticles } from '../services/articleService';
import { FaEye } from "react-icons/fa";

const stripHtml = (html: string) => {
   const tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

import { Helmet } from 'react-helmet-async';

const Blog = () => {
  const [posts, setPosts] = useState([])

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const articlesData : any = await getAllArticles()
        console.log(articlesData);
        
        setPosts(articlesData);
        setLoading(false);
      }catch(error) {
        console.error('Error fetching blog posts:', error);
        setLoading(false);
      }finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, [])

  
  return (
    <div className='py-20 px-6 md:px-32 max-w-5xl mx-auto'>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-gray-100 pb-6">
        <div>
          <h1 className='text-3xl md:text-5xl font-serif font-light text-gray-900 mb-2'>Adi's Journal</h1>
          <p className='text-gray-500 font-light italic'>Engineering, design, and stories.</p>
        </div>
        <div className="mt-4 md:mt-0"> 
          <Link to={'/'} className="text-sm uppercase tracking-widest text-gray-400 hover:text-black transition-colors border-b border-transparent hover:border-black pb-1">Back to Portfolio</Link>
        </div>
      </div>
      
      <div className="space-y-12">
        {!loading ? posts.map((post: any) => (
          <Link to={post.slug} key={post.id} className="block group">
            <article className="flex flex-col md:flex-row gap-8 items-baseline">
                <div className="md:w-1/4 text-sm text-gray-400 font-mono pt-1">
                    {post.date?.toDate ? post.date.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
                </div>
                
                <div className="md:w-3/4">
                    <h2 className="text-2xl font-serif font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                        {post.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed font-light line-clamp-2 mb-4">
                        {stripHtml(post.description)}
                    </p>
                    <div className="flex items-center text-xs text-gray-400 uppercase tracking-wider space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <span>Read Article</span>
                        <div className="flex items-center space-x-1">
                             <FaEye /> <span>{post.views || 0}</span>
                        </div>
                    </div>
                </div>
            </article>
          </Link>
        )) : (
          <div className="space-y-12">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/4 h-4 bg-gray-100 rounded"></div>
                  <div className="md:w-3/4 space-y-3">
                      <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog